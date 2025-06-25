package com.graphhopper.jsprit.util;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.graphhopper.jsprit.optimroute.vrp.VrpInput;
import com.graphhopper.jsprit.optimroute.vrp.VrpInput.DeliveryPoint;
import com.graphhopper.jsprit.optimroute.vrp.VrpOutput;
import com.graphhopper.jsprit.optimroute.vrp.VrpOutput.RouteDeliveryPoint;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;


/**
 * MatrixManager
 */
public class MatrixManager {

    public String url = "";

    public String osrmHost = "https://dev.osrm.polpoo.com";

    public class Matrix {
        public Double[][] durations;
        public Double[][] distances;
    }

    public class DistanceCostFromTo {
        public Costs[][] costs;
    }

    public class DurationCostFromTo {
        String from = "";
        String to = "";
        Double cost = 0.0;
    }

    public class Costs {
        public String from = "";
        public String to = "";
        public Double cost = 0.0;
    }

    public class RouteGeometry {
        String code = "";
        List<Route> routes;
        public class Route {
            String geometry = "";
        }

    }
    public class DistanceBetweenPoints {

        String code = "";
        List<Route> routes;
        public class Route {
            String geometry = "";
            double distance = 0.0;
        }


    }

    public Matrix matrix;

    public MatrixManager(List<VrpInput.DeliveryPoint> deliveryPoints, String type)
            throws MalformedURLException, IOException {
        this.matrix = getMatrixCosts(prepareUrl(deliveryPoints, type));
    }

    public MatrixManager() {
    }

    public URL prepareUrl(List<VrpInput.DeliveryPoint> deliveryPoints, String type) throws MalformedURLException {

        String urlReturn = this.osrmHost;

        urlReturn += "/table/v1/driving/";

        for (int i = 0; i < deliveryPoints.size(); i++) {

            DeliveryPoint deliveryPoint = deliveryPoints.get(i);
            if (i != 0) {

                urlReturn += ";" + deliveryPoint.coordinates.longitude + "," + deliveryPoint.coordinates.latitude;

            } else {

                urlReturn += deliveryPoint.coordinates.longitude + "," + deliveryPoint.coordinates.latitude;
            }

        }

        urlReturn += "?annotations=distance,duration";

        return new URL(urlReturn);
    }

    public Matrix getMatrixCosts(URL url) throws IOException {

        InputStream stream = url.openStream();

        JsonParser parser = new JsonParser();

        JsonElement root = parser.parse(new InputStreamReader(stream));

        JsonArray arrayDistances = root.getAsJsonObject().get("distances").getAsJsonArray();

        Double[][] distances = new Double[arrayDistances.size()][];

        for (int i = 0; i < arrayDistances.size(); i++) {

            JsonArray innerArray = arrayDistances.get(i).getAsJsonArray();

            distances[i] = new Double[innerArray.size()];

            for (int j = 0; j < innerArray.size(); j++) {

                distances[i][j] = innerArray.get(j).getAsDouble();

            }
        }

        JsonArray arrayDurations = root.getAsJsonObject().get("durations").getAsJsonArray();

        Double[][] durations = new Double[arrayDurations.size()][];

        for (int i = 0; i < arrayDurations.size(); i++) {

            JsonArray innerArray = arrayDurations.get(i).getAsJsonArray();

            durations[i] = new Double[innerArray.size()];

            for (int j = 0; j < innerArray.size(); j++) {

                durations[i][j] = innerArray.get(j).getAsDouble();

            }
        }

        Matrix costMatrix = new Matrix();

        costMatrix.distances = distances;

        costMatrix.durations = durations;

        return costMatrix;
    }

    public DistanceCostFromTo getRelationalCostDeliveryPoints(Double[][] distances, String[] names) {

        DistanceCostFromTo distanceCostFromTos = new DistanceCostFromTo();

        Costs[][] distanceCostFromTo = new Costs[distances.length][distances.length];

        for (int i = 0; i < distances.length; i++) {

            for (int j = 0; j < distances[i].length; j++) {

                distanceCostFromTo[i][j] = new Costs();

                distanceCostFromTo[i][j].cost = (double) Math.round( (distances[i][j] / 1000) * 1000);

                distanceCostFromTo[i][j].from = names[i].toString();

                distanceCostFromTo[i][j].to = names[j].toString();

                if ((j + 1) == distances[j].length)
                    distanceCostFromTos.costs = distanceCostFromTo;

            }
        }

        return distanceCostFromTos;
    }

    public String getGeometry(VrpInput input, List<VrpOutput.RouteDeliveryPoint> deliveryPoints)
            throws MalformedURLException, IOException {

        String urlReturn = this.osrmHost;

        urlReturn += "/route/v1/driving/";

        DeliveryPoint depot = input.deliveryPoints.get(0);

        urlReturn += depot.coordinates.longitude + "," + depot.coordinates.latitude;

        for (int i = 0; i < deliveryPoints.size(); i++) {

            RouteDeliveryPoint deliveryPoint = deliveryPoints.get(i);

                urlReturn += ";" + deliveryPoint.longitude + "," + deliveryPoint.latitude;

        }

        urlReturn +=";" + depot.coordinates.longitude + "," + depot.coordinates.latitude;

        urlReturn += "?overview=full&continue_straight=false";

        URL url = new URL(urlReturn);

        InputStream stream = url.openStream();

        JsonParser parser = new JsonParser();

        JsonElement root = parser.parse(new InputStreamReader(stream));

        JsonObject jsonObject = root.getAsJsonObject();

        Gson g = new Gson();

        RouteGeometry routeGeometry = g.fromJson(jsonObject, RouteGeometry.class);

        String geometry = routeGeometry.routes.get(0).geometry;

        return geometry;
    }

    public double getDistanceAndDurationToNextHttp(double latFrom, double lngFrom, double latTo, double lngTo)
            throws IOException
    {

        double distanceReturn = 0;

        try {

            String urlReturn = this.osrmHost;

            urlReturn += "/route/v1/driving/" + lngFrom + "," + latFrom + ";" + lngTo + "," + latTo + "?overview=full&geometries=polyline&continue_straight=false";

            // System.out.println(urlReturn);

            URL url = new URL(urlReturn);

            InputStream stream = url.openStream();

            JsonParser parser = new JsonParser();

            JsonElement root = parser.parse(new InputStreamReader(stream));

            JsonObject jsonObject = root.getAsJsonObject();

            Gson g = new Gson();

            DistanceBetweenPoints distanceBetweenPoints = g.fromJson(jsonObject, DistanceBetweenPoints.class);


            distanceReturn = distanceBetweenPoints.routes.get(0).distance;

        } catch (Exception e) {


        }

        return distanceReturn;
    }

}
