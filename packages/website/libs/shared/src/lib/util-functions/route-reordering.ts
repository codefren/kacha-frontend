import { RoutePlanningDeliveryPoint, Route } from '@optimroute/state-route-planning';

export function removeDeliveryPointFromRoute(route: Route, order: number): Route {
    // console.log('inside', route.deliveryPoints);
    // const l1 = [...route.deliveryPoints.slice(0, Math.max(order - 2, 0))];
    // console.log(l1);
    // const l2 = route.deliveryPoints
    //     .slice(order, route.deliveryPoints.length)
    //     .map((x: RoutePlanningDeliveryPoint) => {
    //         console.log('Ya');
    //         return { ...x, order: x.order - 1 };
    //     });
    // console.log(l2);
    const newDeliveryPoints = [
        ...route.deliveryPoints.slice(0, Math.max(order - 1, 0)),
        ...route.deliveryPoints
            .slice(order, route.deliveryPoints.length)
            .map((x: RoutePlanningDeliveryPoint) => {
                return { ...x, order: x.order - 1 };
            }),
    ];

    return {
        ...route,
        deliveryPoints: newDeliveryPoints,
    };
}

export function addDeliveryPointToRoute(
    route: Route,
    deliveryPoint: RoutePlanningDeliveryPoint,
    newOrder: number,
): Route {
    // const l1 = route.deliveryPoints.slice(0, Math.max(newOrder - 1, 0));
    // console.log(l1);
    // const l2 = route.deliveryPoints
    //     .slice(newOrder - 1, route.deliveryPoints.length)
    //     .map((x: RoutePlanningDeliveryPoint) => {
    //         console.log('YE');
    //         return { ...x, order: x.order + 1 };
    //     });
    // console.log(l2);
    const newDeliveryPoints = [
        ...route.deliveryPoints.slice(0, Math.max(newOrder - 1, 0)),
        {
            ...deliveryPoint,
            order: newOrder,
        },
        ...route.deliveryPoints
            .slice(newOrder - 1, route.deliveryPoints.length)
            .map((x: RoutePlanningDeliveryPoint) => {
                return { ...x, order: x.order + 1 };
            }),
    ];
    return {
        ...route,
        deliveryPoints: newDeliveryPoints,
        settings: {
            ...route.settings,
            optimizeFromIndex: newOrder,
        },
    };
}
