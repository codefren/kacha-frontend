package com.graphhopper.jsprit.optimroute.vrp;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.graphhopper.jsprit.core.problem.Skills;
import com.graphhopper.jsprit.util.MatrixManager;
import com.graphhopper.jsprit.util.MatrixManager.Matrix;

/**
 * VrpInput
 */

public class VrpInput {
    @SerializedName("deliveryPoints")
    public List<DeliveryPoint> deliveryPoints;
    @SerializedName("options")
    public Options options;
    @SerializedName("vehicles")
    public List<VehicleInput> vehicles;

    @SerializedName("matrix")
    public Matrix matrix;

    public class DeliveryPoint {
        public String id = "";
        public String name = "";
        public int demand = 0;
        public int serviceTime = 0;
        public int priority = 1;
        public int leadTime = 0;
        public int readyTime = 0;
        public int dueTime = 0;
        public int allowedDelayTime = 0;
        public Coordinates coordinates;
        public DeliveryWindow deliveryWindow;
        List<Integer> skills = new ArrayList<Integer>();
        public String deliveryType = "";

        public class Coordinates {
            public Double latitude = 0.0;
            public Double longitude = 0.0;
        }

        public class DeliveryWindow {
            public int start = 0;
            public int end = 0;
        }

    };

    public class VehicleInput {
        public int id = 0;
        public String name = "";
        public int capacity = 0;
        public int deliveryWindowStart = 0;
        public int deliveryWindowEnd = 0;
        List<Integer> skills = new ArrayList<Integer>();
    }

    public class Options {
        public int minVehicles = 0;
        public int maxDelayTime = 0;
        public int optimizeFromIndex = 0;
        public boolean allowDelayTime = false;

        public boolean ignoreCapacityLimit = false;
        public int explorationLevel = 0;
        public boolean forceDepartureTime = false;
        public boolean useSkills = false;
        public Traffic traffic;
        public ObjectivePreferences objectivePreferences;

        public class ObjectivePreferences {
            public int costDuration = 0;
            public int costDistance = 0;
            public int costVehicleWaitTime = 0;
        }

        public class Traffic {
            public Range1 range1;
            public Range2 range2;
            public Range3 range3;

            public class Range1 {
                public boolean active = true;
                public int increaseProportion = 0;
                public TimeInterval timeInterval;

                public class TimeInterval {
                    public int start = 21600;
                    public int end = 36000;
                }
            }

            public class Range2 {
                public boolean active = true;
                public int increaseProportion = 0;
                public TimeInterval timeInterval;

                public class TimeInterval {
                    public int start = 36000;
                    public int end = 43200;
                }
            }

            public class Range3 {
                public boolean active = true;
                public int increaseProportion = 0;
                public TimeInterval timeInterval;

                public class TimeInterval {
                    public int start = 43200;
                    public int end = 50400;
                }
            }
        }

    }

    public static VrpInput readAsjsonFrom(String json) throws MalformedURLException, IOException, VrpException {

        VrpInput input = new VrpInput();

        Gson gson = new Gson();

        VrpInput objectJson = gson.fromJson(json, VrpInput.class);

        input.deliveryPoints = objectJson.deliveryPoints;

        input.options = objectJson.options;

        input.vehicles = objectJson.vehicles;

        for (VehicleInput vehicle : input.vehicles) {

            vehicle.deliveryWindowStart = vehicle.deliveryWindowStart == -1 ? 0 : vehicle.deliveryWindowStart;

            vehicle.deliveryWindowEnd = vehicle.deliveryWindowEnd == 0 ? 86399 : vehicle.deliveryWindowEnd;

            if (vehicle.deliveryWindowStart >= vehicle.deliveryWindowEnd) {
                throw new VrpException("403", "El tiempo de inicio (" + vehicle.deliveryWindowStart + ") del vehiculo ("
                        + vehicle.name + ") debe ser mayor al tiempo de llegada (" + vehicle.deliveryWindowEnd + ").");
            }

        }

        for (int i = 0; i < input.deliveryPoints.size(); i++) {
            input.deliveryPoints.get(i).readyTime = input.deliveryPoints.get(i).deliveryWindow.start == -1 ? 0
                    : input.deliveryPoints.get(i).deliveryWindow.start;
            input.deliveryPoints.get(i).dueTime = input.deliveryPoints.get(i).deliveryWindow.end == 0 ? 86399
                    : input.deliveryPoints.get(i).deliveryWindow.end;

            if (i > 0 && input.deliveryPoints.get(i).dueTime <= input.deliveryPoints.get(i).readyTime) {
                throw new VrpException("403",
                        "La hora de apertura (" + input.deliveryPoints.get(i).readyTime
                                + ") debe ser menor a la de cierre (" + input.deliveryPoints.get(i).dueTime
                                + ") en el cliente: " + input.deliveryPoints.get(i).name);
            }

        }


        try {

            Matrix matrix = new MatrixManager(input.deliveryPoints, "table").matrix;

            input.matrix = matrix;
    
        } catch (Exception e) {
            throw new VrpException("403"," No se ha encontrado solución");
        }

        return input;
    }

    static Double calculateEarliestStartFromIndex(VrpInput input, double earliestStartVehicle) {

        double earliestStart = 0.0;

        double travelTimeToFirst = input.matrix.durations[0][0];

        double departureDayTime = earliestStartVehicle;

        double depotDepartureTime = departureDayTime;

        Double time = depotDepartureTime + travelTimeToFirst;

        for (DeliveryPoint deliveryPoint : input.deliveryPoints) {

            if ("depot".equals(deliveryPoint.id)) {
                continue;
            }

            Optional<DeliveryPoint> currentDeliveryPoint = input.deliveryPoints.stream()
                    .filter(x -> deliveryPoint.id.equals(x.id)).findFirst();

            int currentDeliveryPointIndex = input.deliveryPoints.indexOf(currentDeliveryPoint.get());

            if (currentDeliveryPointIndex > input.options.optimizeFromIndex) {

                break;
            }

            int nextId = currentDeliveryPointIndex + 1 >= input.deliveryPoints.size() ? 0
                    : currentDeliveryPointIndex + 1;

            time += deliveryPoint.serviceTime + input.matrix.durations[currentDeliveryPointIndex][nextId];

            time = Math.max(time, deliveryPoint.readyTime + deliveryPoint.serviceTime);
        }

        earliestStart = time;

        return earliestStart;
    }

}
