package com.graphhopper.jsprit.optimroute.vrp;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.graphhopper.jsprit.core.problem.job.Job;
import com.graphhopper.jsprit.core.problem.solution.VehicleRoutingProblemSolution;
import com.graphhopper.jsprit.core.problem.solution.route.VehicleRoute;
import com.graphhopper.jsprit.core.problem.solution.route.activity.TourActivity;
import com.graphhopper.jsprit.optimroute.vrp.VrpInput.DeliveryPoint;
import com.graphhopper.jsprit.util.MatrixManager;

/**
 * VrpOutput
 */

public class VrpOutput {

    int travelDistance = 0;

    Double totalTime = 0.0;

    Double travelTime = 0.0;

    Double vehicleWaitTime = 0.0;

    int customerWaitTime = 0;

    int delayTime = 0;

    int numDelays = 0;

    int customerDisatisfaction = 0;

    int routeTimeBalance = 0;

    int numUsedVehicles = 0;

    int totalLoad = 0;

    int totalVehicleCapacity = 0;

    int capacityUse;

    int avgCustomerWaitTime = 0;

    int overload = 0;

    int unusedCapacity = 0;

    int numConstraintViolations = 0;

    ArrayList<Route> routes = new ArrayList<Route>();

    public class RouteDeliveryPoint {

        int index;

        public String id = "";

        Double arrivalTime = 0.0;

        Double travelTimeToNext = 0.0;

        Double travelDistanceToNext = 0.0;

        Double vehicleWaitTime = 0.0;

        Double delayTime = 0.0;

        Double customerDisatisfaction = 0.0;

        Double customerWaitTime = 0.0;

        public Double latitude = 0.0;

        public Double longitude = 0.0;
    };

    public class Route {

        public ArrayList<RouteDeliveryPoint> deliveryPoints = new ArrayList<RouteDeliveryPoint>();

        public ArrayList<RouteDeliveryPoint> deliveryPointsNotServed = new ArrayList<RouteDeliveryPoint>();

        Double maxDepartureTime = 0.0;

        Double minDepartureTimeNoWait = 0.0;

        Double minDepartureTimeSensible = 0.0;

        Double depotDepartureTime = 0.0;

        Double departureDayTime = 0.0;

        Double travelTimeToFirst = 0.0;

        Double travelDistanceToFirst = 0.0;

        Double depotArrivalTime = 0.0;

        Double depotDelayTime = 0.0;

        Double travelDistance = 0.0;

        Double totalTime = 0.0;

        Double travelTime = 0.0;

        Double vehicleWaitTime = 0.0;

        Double customerWaitTime = 0.0;

        Double delayTime = 0.0;

        int numDelays = 0;

        Double customerDisatisfaction = 0.0;

        int totalLoad = 0;

        int loadSlack = 0;

        int capacityUse = 0;

        Double avgCustomerWaitTime = 0.0;

        Boolean active = true;

        public String geometry = "";

        public int vehicleId = 0;

        public int vehicleIndex = 0;
    };

    public class OutputJson {
        VrpInput input = new VrpInput();
        VrpOutput output = new VrpOutput();
    }

    public VrpOutput() {
    }

    public VrpOutput evaluateRoute(VrpInput input, VehicleRoutingProblemSolution solution)
            throws MalformedURLException, IOException {

        ArrayList<Route> vrpRoutes = new ArrayList<Route>();

        int routeIndex = 0;
        

        for (VehicleRoute route : solution.getRoutes()) {

            List<TourActivity> activities = route.getActivities();

            Route vrpRoute = new Route();

            vrpRoute.active = true;

            vrpRoute.travelTimeToFirst = input.matrix.durations[0][activities.get(0).getIndex()];

            DeliveryPoint deliveryPointDepot = input.deliveryPoints.get(0);

            DeliveryPoint deliveryPointFirst = input.deliveryPoints.get(activities.get(0).getIndex());

            vrpRoute.travelDistanceToFirst  = new MatrixManager().getDistanceAndDurationToNextHttp(deliveryPointDepot.coordinates.latitude,deliveryPointDepot.coordinates.longitude, deliveryPointFirst.coordinates.latitude, deliveryPointFirst.coordinates.longitude);

            // vrpRoute.travelDistanceToFirst = input.matrix.distances[0][activities.get(0).getIndex()];

            vrpRoute.departureDayTime = route.getVehicle().getEarliestDeparture();

            vrpRoute.depotDepartureTime = vrpRoute.departureDayTime;

            Double time = vrpRoute.depotDepartureTime + vrpRoute.travelTimeToFirst;

            vrpRoute.travelDistance = input.matrix.distances[0][activities.get(0).getIndex()];
            
            int i = 0;
            
            if(input.options.optimizeFromIndex > 1) {

                for (DeliveryPoint deliveryPoint : input.deliveryPoints) {

                    if("depot".equals(deliveryPoint.id)) { 
                        continue;
                    }

                    // currentPoint


                    Optional<DeliveryPoint> currentDeliveryPoint = input.deliveryPoints.stream()
                    .filter(x ->  deliveryPoint.id.equals(x.id) )
                    .findFirst();

                    int currentDeliveryPointIndex = input.deliveryPoints.indexOf(currentDeliveryPoint.get());
                    
                    if(currentDeliveryPointIndex >= input.options.optimizeFromIndex) {
                        
                        continue;
                    }

                    RouteDeliveryPoint routeDeliveryPoint = new RouteDeliveryPoint();
                    

                    int next_id = currentDeliveryPointIndex + 1 >= input.deliveryPoints.size() ? 0 : currentDeliveryPointIndex + 1;

                    DeliveryPoint nextDeliveryPoint = input.deliveryPoints.get(next_id);
                    
                    routeDeliveryPoint.id = deliveryPoint.id;
    
                    routeDeliveryPoint.latitude = deliveryPoint.coordinates.latitude;
    
                    routeDeliveryPoint.longitude = deliveryPoint.coordinates.longitude;
    
                    routeDeliveryPoint.index = currentDeliveryPointIndex;
    
                    routeDeliveryPoint.delayTime = Math.max(0, time - deliveryPoint.dueTime);
                    
                    routeDeliveryPoint.travelTimeToNext = input.matrix.durations[currentDeliveryPointIndex][next_id];

                    routeDeliveryPoint.travelDistanceToNext = new MatrixManager().getDistanceAndDurationToNextHttp(deliveryPoint.coordinates.latitude,deliveryPoint.coordinates.longitude, nextDeliveryPoint.coordinates.latitude, nextDeliveryPoint.coordinates.longitude);
        
                    routeDeliveryPoint.vehicleWaitTime = Math.max(0, deliveryPoint.readyTime - time);
    
                    routeDeliveryPoint.customerWaitTime = Math.max(0, time - deliveryPoint.readyTime);
    
                    routeDeliveryPoint.customerDisatisfaction = Math.max(0, time - deliveryPoint.readyTime)
                            * deliveryPoint.priority;
    
                    
    
                    time = Math.max(time, deliveryPoint.readyTime);
    
                    routeDeliveryPoint.arrivalTime = time;
    
                    vrpRoute.travelTime += routeDeliveryPoint.travelTimeToNext;
    
                    vrpRoute.delayTime += routeDeliveryPoint.delayTime;
    
                    if (routeDeliveryPoint.delayTime > 0.0) {
    
                        vrpRoute.numDelays += 1;
    
                    }
    
                    vrpRoute.vehicleWaitTime += routeDeliveryPoint.vehicleWaitTime;
    
                    vrpRoute.travelDistance += routeDeliveryPoint.travelDistanceToNext;
    
                    vrpRoute.customerDisatisfaction += routeDeliveryPoint.customerDisatisfaction;
    
                    vrpRoute.totalLoad += deliveryPoint.demand;
    
                    vrpRoute.customerWaitTime += routeDeliveryPoint.customerWaitTime;
    
                    time += deliveryPoint.serviceTime + routeDeliveryPoint.travelTimeToNext;
    
                    vrpRoute.deliveryPoints.add(routeDeliveryPoint);
                        
                }
            }

            for (TourActivity act : activities) {

                Job currentjob = ((TourActivity.JobActivity) act).getJob();

                Job nextJob = i + 1 >= activities.size() ? ((TourActivity.JobActivity) activities.get(0) ).getJob() : ((TourActivity.JobActivity) activities.get(i + 1) ).getJob();
                
                // currentPoint

                DeliveryPoint deliveryPoint = input.options.optimizeFromIndex > 1 ? input.deliveryPoints.get(currentjob.getIndex() + input.options.optimizeFromIndex - 1 ) : input.deliveryPoints.get(currentjob.getIndex());
                
                int deliveryPointIndex = input.deliveryPoints.indexOf(deliveryPoint);

                // nextPoint
                
                DeliveryPoint nextDeliveryPoint = input.options.optimizeFromIndex > 1 ? input.deliveryPoints.get(nextJob.getIndex() + input.options.optimizeFromIndex - 1) : input.deliveryPoints.get(nextJob.getIndex());

                int deliveryPointNextIndex = input.deliveryPoints.indexOf(nextDeliveryPoint);

                RouteDeliveryPoint routeDeliveryPoint = new RouteDeliveryPoint();

                int next_id = i + 1 >= route.getActivities().size() ? 0 : deliveryPointNextIndex;

                routeDeliveryPoint.id = deliveryPoint.id;

                routeDeliveryPoint.latitude = deliveryPoint.coordinates.latitude;

                routeDeliveryPoint.longitude = deliveryPoint.coordinates.longitude;

                routeDeliveryPoint.index = i;

                routeDeliveryPoint.delayTime = Math.max(0, time - deliveryPoint.dueTime);                

                routeDeliveryPoint.travelTimeToNext = input.matrix.durations[deliveryPointIndex][next_id];

                // routeDeliveryPoint.travelDistanceToNext = input.matrix.distances[deliveryPointIndex][next_id];

                nextDeliveryPoint = input.deliveryPoints.get(next_id);

                routeDeliveryPoint.travelDistanceToNext = new MatrixManager().getDistanceAndDurationToNextHttp(deliveryPoint.coordinates.latitude,deliveryPoint.coordinates.longitude, nextDeliveryPoint.coordinates.latitude, nextDeliveryPoint.coordinates.longitude);

                routeDeliveryPoint.vehicleWaitTime = Math.max(0, deliveryPoint.readyTime - time);

                routeDeliveryPoint.customerWaitTime = Math.max(0, time - deliveryPoint.readyTime);

                routeDeliveryPoint.customerDisatisfaction = Math.max(0, time - deliveryPoint.readyTime)
                        * deliveryPoint.priority;

                

                time = Math.max(time, deliveryPoint.readyTime);

                routeDeliveryPoint.arrivalTime = time;

                vrpRoute.travelTime += routeDeliveryPoint.travelTimeToNext;

                vrpRoute.delayTime += routeDeliveryPoint.delayTime;

                if (routeDeliveryPoint.delayTime > 0.0) {

                    vrpRoute.numDelays += 1;

                }

                vrpRoute.vehicleWaitTime += routeDeliveryPoint.vehicleWaitTime;

                vrpRoute.travelDistance += routeDeliveryPoint.travelDistanceToNext;

                vrpRoute.customerDisatisfaction += routeDeliveryPoint.customerDisatisfaction;

                vrpRoute.totalLoad += deliveryPoint.demand;

                vrpRoute.customerWaitTime += routeDeliveryPoint.customerWaitTime;

                time += deliveryPoint.serviceTime + routeDeliveryPoint.travelTimeToNext;

                vrpRoute.deliveryPoints.add(routeDeliveryPoint);

                i++;
            }

            if(!input.options.allowDelayTime ) {
                
                for (Job unassignedJobs : solution.getUnassignedJobs()) {
                
                    DeliveryPoint deliveryPoint = input.options.optimizeFromIndex > 1 ? input.deliveryPoints.get(unassignedJobs.getIndex() + input.options.optimizeFromIndex - 1 ) : input.deliveryPoints.get(unassignedJobs.getIndex());
    
                    RouteDeliveryPoint deliveryPointNotServed =  new RouteDeliveryPoint();
                    
                    deliveryPointNotServed.id = deliveryPoint.id;
    
                    vrpRoute.deliveryPointsNotServed.add(deliveryPointNotServed);
        
                }
            
            } else {

                int j = 1;

                Collection<Job> unassignedJobsCollection = solution.getUnassignedJobs();

                double vehicleFinishtime = route.getVehicle().getLatestArrival();
                
                List<Job> list = new ArrayList(unassignedJobsCollection);

                for (Job unassignedJobs : solution.getUnassignedJobs()) {
                
                    Job currentjob = unassignedJobs;

                    Job nextJob = j + 1 >= solution.getUnassignedJobs().size() ? ((TourActivity.JobActivity) activities.get(0) ).getJob() : list.get(j + 1);

                    // Current point

                    DeliveryPoint deliveryPoint = input.options.optimizeFromIndex > 1 ? input.deliveryPoints.get(unassignedJobs.getIndex() + input.options.optimizeFromIndex - 1 ) : input.deliveryPoints.get(unassignedJobs.getIndex());
                    
                    int deliveryPointIndex = input.deliveryPoints.indexOf(deliveryPoint);

                    // Next point 

                    DeliveryPoint nextDeliveryPoint = input.options.optimizeFromIndex > 1 ? input.deliveryPoints.get(nextJob.getIndex() + input.options.optimizeFromIndex - 1) : input.deliveryPoints.get(nextJob.getIndex());

                    int deliveryPointNextIndex = input.deliveryPoints.indexOf(nextDeliveryPoint);
                    

                    // Se toma en cuenta que el vehiculo esté en su horario para poder llegar al depot

                    double timeFromCurrentPointToDepot = time + input.matrix.durations[deliveryPointIndex][0]; 
                    
                    if(timeFromCurrentPointToDepot > vehicleFinishtime) {
                                        
                        RouteDeliveryPoint deliveryPointNotServed =  new RouteDeliveryPoint();
                    
                        deliveryPointNotServed.id = deliveryPoint.id;
        
                        vrpRoute.deliveryPointsNotServed.add(deliveryPointNotServed);
    
                        continue;
                    }


                    RouteDeliveryPoint routeDeliveryPoint =  new RouteDeliveryPoint();

                    int next_id = j + i + 1 >= route.getActivities().size() + solution.getUnassignedJobs().size() ? 0 : deliveryPointNextIndex;
                    
                    routeDeliveryPoint.id = deliveryPoint.id;

                    routeDeliveryPoint.latitude = deliveryPoint.coordinates.latitude;

                    routeDeliveryPoint.longitude = deliveryPoint.coordinates.longitude;
    
                    routeDeliveryPoint.index = i;

                    routeDeliveryPoint.delayTime = Math.max(0, time - deliveryPoint.dueTime);

                    routeDeliveryPoint.travelTimeToNext = input.matrix.durations[deliveryPointIndex][next_id];

                    // routeDeliveryPoint.travelDistanceToNext = input.matrix.distances[deliveryPointIndex][next_id];

                    nextDeliveryPoint = input.deliveryPoints.get(next_id);
                
                    routeDeliveryPoint.travelDistanceToNext = new MatrixManager().getDistanceAndDurationToNextHttp(deliveryPoint.coordinates.latitude,deliveryPoint.coordinates.longitude, nextDeliveryPoint.coordinates.latitude, nextDeliveryPoint.coordinates.longitude);
    
                    routeDeliveryPoint.vehicleWaitTime = Math.max(0, deliveryPoint.readyTime - time);

                    routeDeliveryPoint.customerWaitTime = Math.max(0, time - deliveryPoint.readyTime);
    
                    routeDeliveryPoint.customerDisatisfaction = Math.max(0, time - deliveryPoint.readyTime)
                            * deliveryPoint.priority;

                    time = Math.max(time, deliveryPoint.readyTime);

                    routeDeliveryPoint.arrivalTime = time;
                    // de aqui para abajo
                    vrpRoute.travelTime += routeDeliveryPoint.travelTimeToNext;
    
                    vrpRoute.delayTime += routeDeliveryPoint.delayTime;
    
                    if (routeDeliveryPoint.delayTime > 0.0) {
    
                        vrpRoute.numDelays += 1;
    
                    }
 
                    vrpRoute.vehicleWaitTime += routeDeliveryPoint.vehicleWaitTime;

                    vrpRoute.travelDistance += routeDeliveryPoint.travelDistanceToNext;
    
                    vrpRoute.customerDisatisfaction += routeDeliveryPoint.customerDisatisfaction;
    
                    vrpRoute.totalLoad += deliveryPoint.demand;
    
                    vrpRoute.customerWaitTime += routeDeliveryPoint.customerWaitTime;
    
                    time += deliveryPoint.serviceTime + routeDeliveryPoint.travelTimeToNext;
    
                    vrpRoute.deliveryPoints.add(routeDeliveryPoint);

                    j++;

                    i++;
        
                }
            
            }

            vrpRoute.loadSlack = input.vehicles.get(route.getVehicle().getIndex() -1 ).capacity - vrpRoute.totalLoad;

            vrpRoute.capacityUse = input.vehicles.get(route.getVehicle().getIndex() -1 ).capacity > 0
                    ? vrpRoute.totalLoad / input.vehicles.get(route.getVehicle().getIndex() -1 ).capacity
                    : 1;

            vrpRoute.depotArrivalTime = time;

            vrpRoute.depotDelayTime = Math.max(0, vrpRoute.depotArrivalTime - input.deliveryPoints.get(0).dueTime);

            vrpRoute.totalTime = time - vrpRoute.depotDepartureTime;

            vrpRoute.avgCustomerWaitTime = vrpRoute.customerWaitTime / vrpRoute.deliveryPoints.size();

            vrpRoute.departureDayTime = vrpRoute.depotDepartureTime;

            vrpRoute.vehicleId = input.vehicles.get(route.getVehicle().getIndex() -1 ).id;

            vrpRoute.vehicleIndex = route.getVehicle().getIndex() -1;
            vrpRoute.geometry = new MatrixManager().getGeometry(input,vrpRoute.deliveryPoints);

            vrpRoutes.add(vrpRoute);

            routeIndex++;



        }
        if(vrpRoutes.size() == 0) {
            
            throw new VrpException("403", "No se ha encontrado solución");
        }

        return totalizeVrpRoute(vrpRoutes, input);

    }

    public String printOutputToJson(VrpInput vrpInput, VrpOutput vrpOutput, String outputFileName) throws IOException {

        OutputJson outputJson = new OutputJson();

        outputJson.input = vrpInput;

        outputJson.input.matrix = null;

        outputJson.output = vrpOutput;

        Gson gson = new GsonBuilder().create();
 
        String json = gson.toJson(outputJson);

        BufferedWriter writer = new BufferedWriter(new FileWriter(outputFileName));
        
        writer.write(json);
            
        writer.close();

        String jsonOuput = gson.toJson(outputJson.output);

        
        return jsonOuput;
        
    }


    public VrpOutput totalizeVrpRoute(List<Route> vrpRoutes, VrpInput input) {

        int i = 0;

        VrpOutput vrpOutput = new VrpOutput();

        for (Route vrpRoute : vrpRoutes) {

            vrpOutput.routes.add(vrpRoute);

            if (vrpRoute.active) {

                vrpOutput.totalTime += vrpRoute.totalTime;

                vrpOutput.travelTime += vrpRoute.travelTime;

                vrpOutput.vehicleWaitTime += vrpRoute.vehicleWaitTime;

                vrpOutput.delayTime += vrpRoute.delayTime;

                vrpOutput.numDelays += vrpRoute.numDelays;

                vrpOutput.customerDisatisfaction += vrpRoute.customerDisatisfaction;

                vrpOutput.travelDistance += vrpRoute.travelDistance;

                vrpOutput.totalLoad += vrpRoute.totalLoad;

                vrpOutput.totalVehicleCapacity += input.vehicles.get(vrpRoute.vehicleIndex).capacity;

                vrpOutput.customerWaitTime += vrpRoute.customerWaitTime;

                vrpOutput.unusedCapacity += Math.max(0, vrpRoute.loadSlack);

                vrpOutput.overload += Math.max(0, -vrpRoute.loadSlack);

                vrpOutput.capacityUse += vrpRoute.capacityUse;

                vrpOutput.avgCustomerWaitTime = vrpOutput.customerWaitTime / input.deliveryPoints.size();

                vrpOutput.numConstraintViolations += vrpOutput.numConstraintViolations;

                i++;
            }
        }

        return vrpOutput;
    }
}
    