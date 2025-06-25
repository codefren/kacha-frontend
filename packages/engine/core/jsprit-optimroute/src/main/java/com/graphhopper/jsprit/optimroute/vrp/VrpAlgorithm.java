package com.graphhopper.jsprit.optimroute.vrp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.graphhopper.jsprit.core.algorithm.VehicleRoutingAlgorithm;
import com.graphhopper.jsprit.core.algorithm.box.Jsprit;
import com.graphhopper.jsprit.core.algorithm.state.StateManager;
import com.graphhopper.jsprit.core.problem.Location;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem;
import com.graphhopper.jsprit.core.problem.VehicleRoutingProblem.FleetSize;
import com.graphhopper.jsprit.core.problem.constraint.ConstraintManager;
import com.graphhopper.jsprit.core.problem.constraint.SoftActivityConstraint;
import com.graphhopper.jsprit.core.problem.job.Delivery;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.job.Pickup;
import com.graphhopper.jsprit.core.problem.misc.JobInsertionContext;
import com.graphhopper.jsprit.core.problem.solution.SolutionCostCalculator;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.problem.solution.route.activity.BreakActivity;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TourActivity;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleImpl.Builder;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleType;
import com.graphhopper.jsprit.core.problem.vehicle.VehicleTypeImpl;
import com.graphhopper.jsprit.core.util.Coordinate;
import com.graphhopper.jsprit.core.util.Solutions;
import com.graphhopper.jsprit.core.util.VehicleRoutingTransportCostsMatrix;
import com.graphhopper.jsprit.optimroute.vrp.VrpInput.DeliveryPoint;
import com.graphhopper.jsprit.optimroute.vrp.VrpInput.VehicleInput;
import com.graphhopper.jsprit.util.MatrixManager;
import com.graphhopper.jsprit.util.MatrixManager.Costs;
import com.graphhopper.jsprit.util.MatrixManager.DistanceCostFromTo;
import com.graphhopper.jsprit.util.ProgressListener;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TourActivity.JobActivity;


/**
 * VrpAlgorithm
 */
public class VrpAlgorithm {

    public VehicleRoutingProblemSolution run(final VrpInput input) throws IOException {

        final VehicleRoutingProblem.Builder vrpInitialSolutionBuilder = VehicleRoutingProblem.Builder.newInstance();

        // Location Depot

        final Location depotLocation = Location.newInstance(

                input.deliveryPoints.get(0).coordinates.latitude,

                input.deliveryPoints.get(0).coordinates.longitude);

        final int WEIGHT_INDEX = 0;

        List<Location> locationAdded = new ArrayList<>();

        for (int i = 0; i < input.vehicles.size(); i++) {

            final VehicleInput vehicleInput = input.vehicles.get(i);

            final VehicleTypeImpl.Builder vehicleTypeBuilder = VehicleTypeImpl.Builder.newInstance("vehicleType" + i)

            // forma 3  // esta fina
            .setCostPerDistance(1.6)
            .setCostPerTransportTime(0)
            .setCostPerWaitingTime(6.4);


            // Add Capacity

            vehicleTypeBuilder.addCapacityDimension(WEIGHT_INDEX, vehicleInput.capacity);

            final VehicleType vehicleType = vehicleTypeBuilder.build();

            final Builder vehicleBuilder = VehicleImpl.Builder.newInstance("vehicle" + i);

            final double vehicleDeliveryWindowStart = vehicleInput.deliveryWindowStart;

            final double vehicleDeliveryWindowEnd = vehicleInput.deliveryWindowEnd == 0 ? 86399
                    : vehicleInput.deliveryWindowEnd;

            vehicleBuilder.setType(vehicleType);

            vehicleBuilder.setLatestArrival(vehicleDeliveryWindowEnd);

            // Add Skills

            if(input.options.useSkills) {

                if (vehicleInput.skills != null) {
                    for (Integer skill : vehicleInput.skills) {

                        vehicleBuilder.addSkill("skill_" + skill);
                    }
                }

            }

            if (input.options.optimizeFromIndex > 1) {

                vehicleBuilder.setStartLocation(Location.newInstance(
                        input.deliveryPoints.get(input.options.optimizeFromIndex - 1).coordinates.latitude,
                        input.deliveryPoints.get(input.options.optimizeFromIndex - 1).coordinates.longitude));

                final Double earliestStartFromIndex = VrpInput.calculateEarliestStartFromIndex(input,
                        vehicleDeliveryWindowStart);
                
                vehicleBuilder.setEarliestStart(earliestStartFromIndex);

                if(earliestStartFromIndex >= vehicleDeliveryWindowEnd) {
                
                    throw new VrpException("403", "El tiempo de llegada del vehiculo debe ser mayor al de inicio.");
                }

            } else {

                vehicleBuilder.setStartLocation(depotLocation);

                vehicleBuilder.setEarliestStart(vehicleDeliveryWindowStart);

            }

            vehicleBuilder.setEndLocation(depotLocation);



            final VehicleImpl vehicle = vehicleBuilder.build();


            vrpInitialSolutionBuilder.addVehicle(vehicle);

        }
        // Array from names to compare with index and matrix

        final String[] servicesName = new String[input.deliveryPoints.size()];

        servicesName[0] = depotLocation.getId();

        for (int i = 1; i < input.deliveryPoints.size(); i++) {

            final DeliveryPoint deliveryPoint = input.deliveryPoints.get(i);

            // final Location location = Location.newInstance(deliveryPoint.coordinates.latitude, deliveryPoint.coordinates.longitude);

            final Location location = Location.Builder.newInstance()
            .setCoordinate(Coordinate.newInstance(deliveryPoint.coordinates.latitude, deliveryPoint.coordinates.longitude))
            .setIndex(i)
            .build();

            final String name =  i + "";

            servicesName[i] = location.getId();

            double deliveryWindowStart = deliveryPoint.deliveryWindow.start > 0 ?  deliveryPoint.deliveryWindow.start : 0;

            // deliveryWindowStart = (deliveryWindowStart >= deliveryPoint.leadTime) ? deliveryWindowStart - deliveryPoint.leadTime : deliveryWindowStart;

            double deliveryWindowEnd =  deliveryPoint.deliveryWindow.end > 0 ?  deliveryPoint.deliveryWindow.end : 86399;

            if(input.options.allowDelayTime) {
                
                deliveryWindowEnd = deliveryPoint.allowedDelayTime > 0 ? deliveryWindowEnd + deliveryPoint.allowedDelayTime : deliveryWindowEnd;

            }

            List<String> deliveryPointSkills = new ArrayList<>();


            if(input.options.useSkills) {

                if(deliveryPoint.skills != null) {

                    for (Integer skill : deliveryPoint.skills) {

                        deliveryPointSkills.add("skill_" + skill); // Simplified
                    }
                }
            }
            String serviceType = deliveryPoint.deliveryType == null ? "" : deliveryPoint.deliveryType;

            int serviceTime = deliveryPoint.serviceTime;

            

           /* for (Location locationAddedsCompare : locationAdded) {

                if(locationAddedsCompare.getId().toString().equals(location.getId().toString())) {
                    
                    input.deliveryPoints.get(i).serviceTime = 0;
                    
                    // deliveryPoint.serviceTime = 0;

                    serviceTime = 0;
                }

            }*/

            locationAdded.add(location);


            if(serviceType.equals("shipment") || serviceType.equals("")) {

                Delivery service = Delivery.Builder.newInstance(name)
                .addSizeDimension(WEIGHT_INDEX, input.options.ignoreCapacityLimit == false ? deliveryPoint.demand : 0 )
                .setLocation(location)
                .addTimeWindow( deliveryWindowStart, deliveryWindowEnd)
                .setServiceTime(serviceTime)
                .setName(location.getId())
                .addAllRequiredSkills(deliveryPointSkills)

                .build();
        
                if (input.options.optimizeFromIndex > 1) {

                    if (i >= input.options.optimizeFromIndex) {

                        vrpInitialSolutionBuilder.addJob(service);

                    }

                } else {

                    vrpInitialSolutionBuilder.addJob(service);
                }

            } else {

                Pickup service = Pickup.Builder.newInstance(name)
                .addSizeDimension(WEIGHT_INDEX, input.options.ignoreCapacityLimit == false ? deliveryPoint.demand : 0 )
                .setLocation(location)
                .addTimeWindow( deliveryWindowStart, deliveryWindowEnd)
                .setServiceTime(serviceTime)
                .setName(location.getId())
                .addAllRequiredSkills(deliveryPointSkills)
                .build();

                if (input.options.optimizeFromIndex > 1) {

                    if (i >= input.options.optimizeFromIndex) {

                        vrpInitialSolutionBuilder.addJob(service);

                    }

                } else {

                    vrpInitialSolutionBuilder.addJob(service);
                }
            }


        }

        // Build transport cost matrix

        final VehicleRoutingTransportCostsMatrix.Builder costMatrixBuilder = VehicleRoutingTransportCostsMatrix.Builder
                .newInstance(false);

        // Cost Matrix

        final MatrixManager matrixManager = new MatrixManager();

        final DistanceCostFromTo distanceCostFromTos = matrixManager.getRelationalCostDeliveryPoints(input.matrix.distances,
                servicesName);

        final DistanceCostFromTo durationsCostFromTos = matrixManager.getRelationalCostDeliveryPoints(input.matrix.durations,
                servicesName);

        // Costs distance

        for (int i = 0; i < input.deliveryPoints.size(); i++) {

            for (int j = 0; j < distanceCostFromTos.costs[i].length; j++) {

                final Costs cost = distanceCostFromTos.costs[i][j];

                costMatrixBuilder.addTransportDistance(cost.from, cost.to, cost.cost);

            }

        }

        // Costs durations

        for (int i = 0; i < input.deliveryPoints.size(); i++) {

            for (int j = 0; j < durationsCostFromTos.costs[i].length; j++) {

                final Costs cost = durationsCostFromTos.costs[i][j];

                costMatrixBuilder.addTransportTime(cost.from, cost.to, cost.cost);

            }

        }
        // Construct the algorithm

        vrpInitialSolutionBuilder.setRoutingCost(costMatrixBuilder.build()).setFleetSize(FleetSize.FINITE);

        final VehicleRoutingProblem problem = vrpInitialSolutionBuilder.build();

        final StateManager stateManager = new StateManager(problem);

        final ConstraintManager constraintManager = new ConstraintManager(problem, stateManager);

        constraintManager.addConstraint(new jobNearSoftActivityConstratint());
        

        constraintManager.addConstraint(new PrioritySoftActivityConstratint(input));
 
        final RewardAndPenaltiesThroughSoftConstraints contrib = new RewardAndPenaltiesThroughSoftConstraints(problem, input); 
        
        //-------------------Default Algorithm jsprit-------------------
              
        // VehicleRoutingAlgorithm algorithm = VehicleRoutingAlgorithms.readAndCreateAlgorithm(problem,  "input/algorithmConfig.xml");

        //----------------Customized Algorithm Optimroute ---------------

       String searchStrategy = "strategy.searchStrategies.searchStrategy";
       final VehicleRoutingAlgorithm algorithm = Jsprit.Builder.newInstance(problem)
        .setProperty("construction.insertion[@name]", "regretInsertion")
        .setProperty("strategy.memory", "3")
        .setProperty(searchStrategy + "(0)[@name]", "randomRR")
        .setProperty(searchStrategy + "(0).selector[@name]", "selectBest")
        .setProperty(searchStrategy + "(0).acceptor[@name]", "schrimpfAcceptance")
        .setProperty(searchStrategy + "(0).modules.module(0)[@name]", "ruin_and_recreate")
        .setProperty(searchStrategy + "(0).modules.module(0).ruin[@name]", "randomRuin")
        .setProperty(searchStrategy + "(0).modules.module(0).ruin.share", "0.3")
        .setProperty(searchStrategy + "(0).modules.module(0).insertion[@name]", "regretInsertion")
        .setProperty(searchStrategy + "(0).probability", "0.4")


        .setProperty(searchStrategy + "(1)[@name]", "radialRR")
        .setProperty(searchStrategy + "(1).selector[@name]", "selectBest")
        .setProperty(searchStrategy + "(1).acceptor[@name]", "schrimpfAcceptance")
        .setProperty(searchStrategy + "(1).modules.module(0)[@name]", "ruin_and_recreate")
        .setProperty(searchStrategy + "(1).modules.module(0).ruin[@name]", "radialRuin")
        .setProperty(searchStrategy + "(1).modules.module(0).ruin.share", "0.05")
        .setProperty(searchStrategy + "(1).modules.module(0).insertion[@name]", "regretInsertion")
        .setProperty(searchStrategy + "(1).probability", "0.2")
        .setStateAndConstraintManager(stateManager, constraintManager)
        .setObjectiveFunction(new SolutionCostCalculator() {
            @Override
            public double getCosts(final VehicleRoutingProblemSolution solution) {
                double costs = 0.;
                double maxCosts = 1.0E30;

                for (VehicleRoute route : solution.getRoutes()) {
                    costs += route.getVehicle().getType().getVehicleCostParams().fix;
                    costs += route.getVehicle().getType().getVehicleCostParams().perDistanceUnit;
                    costs += route.getVehicle().getType().getVehicleCostParams().perWaitingTimeUnit;
                    boolean hasBreak = false;
                    TourActivity prevAct = route.getStart();
                    for (TourActivity act : route.getActivities()) {
                        if (act instanceof BreakActivity) hasBreak = true;
                        costs += problem.getTransportCosts().getTransportCost(prevAct.getLocation(), act.getLocation(), prevAct.getEndTime(), route.getDriver(), route.getVehicle());
                        costs += problem.getActivityCosts().getActivityCost(act, act.getArrTime(), route.getDriver(), route.getVehicle());
                        
                        Job currentjob = ((TourActivity.JobActivity) act).getJob();

                        costs += Math.max(0, prevAct.getTheoreticalEarliestOperationStartTime() -  input.deliveryPoints.get(currentjob.getIndex()).deliveryWindow.start);

                        prevAct = act;

                    }
                    costs += problem.getTransportCosts().getTransportCost(prevAct.getLocation(), route.getEnd().getLocation(), prevAct.getEndTime(), route.getDriver(), route.getVehicle());
                    if (route.getVehicle().getBreak() != null) {
                        if (!hasBreak) {
                            //break defined and required but not assigned penalty
                            if (route.getEnd().getArrTime() > route.getVehicle().getBreak().getTimeWindow().getEnd()) {
                                costs += 4 * (maxCosts * 2 + route.getVehicle().getBreak().getServiceDuration() * route.getVehicle().getType().getVehicleCostParams().perServiceTimeUnit);
                            }
                        }
                    }

                        double contribReward = contrib.getCosts(route);
                        
                        costs-=contribReward;
                        
                    
                }



                for(Job j : solution.getUnassignedJobs()){
                    costs += maxCosts * 2 * (11 + j.getPriority());
                }
                
                return costs;
            }
        })
        .buildAlgorithm();

        final int maxIterations = 2000;

        algorithm.setMaxIterations(maxIterations);

        algorithm.getAlgorithmListeners().addListener(new ProgressListener(maxIterations));

        final Collection<VehicleRoutingProblemSolution> solutions = algorithm.searchSolutions();

        final VehicleRoutingProblemSolution bestSolution = Solutions.bestOf(solutions);

        return bestSolution;



    }
	static class RewardAndPenaltiesThroughSoftConstraints {
		private final VehicleRoutingProblem vrp;
        private final VrpInput input;

		public RewardAndPenaltiesThroughSoftConstraints(final VehicleRoutingProblem vrp, VrpInput input) {
			super();
            this.vrp = vrp;
            this.input = input;
		}
		
		public double getCosts(final VehicleRoute route) {
                
                TourActivity lastAct = route.getStart();
                double contrib = 0.;
                if(vrp.getJobs().size() == route.getActivities().size()) {

                    for(final TourActivity act : route.getActivities()){
                        if(act instanceof JobActivity && lastAct instanceof JobActivity){
                            
                            // puntos en la misma coordenada

                            if( ((JobActivity)act).getLocation().getId().equalsIgnoreCase(((JobActivity)lastAct).getLocation().getId())) {

                                contrib+= 1400;
                            
                            }
                            
                            // Misma hora de apertura

                            if(input.deliveryPoints.get(act.getLocation().getIndex()).deliveryWindow.start == input.deliveryPoints.get(lastAct.getLocation().getIndex()).deliveryWindow.start) {

                                contrib+= 200;
                            
                            }

                            // Cercania en metros

                            if(input.matrix.distances[act.getLocation().getIndex()][lastAct.getLocation().getIndex()] <= 100) {

                                contrib+= 1400;
                            
                            }

                            // premiar los que tengan un cierto tiempo de diferencia en la hora de apertura
                            
                            /* if(differenceTimeStart > 0 && differenceTimeStart <= 1800) {

                                contrib+= 800;

                            }*/

                        }
                        
                        lastAct=act;
                    }
                }

				return contrib;
			
		}

	}

	static class jobNearSoftActivityConstratint implements SoftActivityConstraint {
        

		@Override
		public double getCosts(final JobInsertionContext iFacts,final TourActivity prevAct, final TourActivity newAct,final TourActivity nextAct, final double prevActDepTime) {
            double costs = 0.;

            if( (prevAct instanceof JobActivity && newAct instanceof JobActivity)){
				if( ((JobActivity)prevAct).getLocation().equals(((JobActivity)newAct).getLocation())) {
                    
                    costs -=500;

                }

				
			}
			if(newAct instanceof JobActivity && nextAct instanceof JobActivity){
                if( ((JobActivity)newAct).getLocation().equals(((JobActivity)nextAct).getLocation())) {
                    
                    costs -=500;

				} 
            }
            
			return costs;
		}
		
    }

	static class PrioritySoftActivityConstratint implements SoftActivityConstraint {
        private final VrpInput input;
        
        public PrioritySoftActivityConstratint(VrpInput input) {
			super();
            this.input = input;

		}
		@Override
		public double getCosts(final JobInsertionContext iFacts,final TourActivity prevAct, final TourActivity newAct,final TourActivity nextAct, final double prevActDepTime) {
            double cost = 0;
                        
            cost += Math.max(0, prevAct.getTheoreticalEarliestOperationStartTime() - input.deliveryPoints.get(iFacts.getJob().getIndex()).deliveryWindow.start);


            cost += Math.max(0, input.deliveryPoints.get(iFacts.getJob().getIndex()).deliveryWindow.start -  nextAct.getTheoreticalEarliestOperationStartTime());

            

			return cost * 2;
		}
		
    }
}