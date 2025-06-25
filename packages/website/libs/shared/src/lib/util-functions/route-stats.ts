import { RoutePlanningSolution } from '@optimroute/state-route-planning';

export const computeStats = (solution: RoutePlanningSolution) => {
    let totalTime = 0,
        totalTravelTime = 0,
        totalVehicleWaitTime = 0,
        totalCustomerWaitTime = 0,
        avgCustomerWaitTime = 0,
        totalDelayTime = 0,
        avgDelayTime = 0,
        totalTravelDistance = 0,
        totalDeliveryPointsServicedLate = 0;

    for (const route of solution.routes) {
        totalTime += route.time;
        totalTravelTime += route.travelTime;
        totalVehicleWaitTime += route.vehicleWaitTime;
        totalCustomerWaitTime += route.customerWaitTime;
        avgCustomerWaitTime += route.avgCustomerWaitTime;
        totalDelayTime += route.delayTime;
        totalTravelDistance += route.travelDistance;
        totalDeliveryPointsServicedLate += route.deliveryPointsServicedLate;
    }

    avgCustomerWaitTime /= Math.max(solution.routes.length, 1);
    avgDelayTime /= Math.max(solution.routes.length, 1);

    solution.totalTime = totalTime;
    solution.totalTravelTime = totalTravelTime;
    solution.totalVehicleWaitTime = totalVehicleWaitTime;
    solution.totalCustomerWaitTime = totalCustomerWaitTime;
    solution.avgCustomerWaitTime = avgCustomerWaitTime;
    solution.totalDelayTime = totalDelayTime;
    solution.avgDelayTime = avgDelayTime;
    solution.totalTravelDistance = totalTravelDistance;
    solution.totalDeliveryPointsServicedLate = totalDeliveryPointsServicedLate;
};
