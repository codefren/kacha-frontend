import log from './logger';

export enum ExportFormat {
    CSV,
    JSON,
}

export function exportOptimizations(deliveryZones: {}, format: ExportFormat) {
    switch (format) {
        case ExportFormat.CSV:
            return exportToCSV(deliveryZones);
        case ExportFormat.JSON:
            return exportToJSON(deliveryZones);
    }
}

function exportToJSON(deliveryZones: {}) {
    console.log(deliveryZones);
    const routes = [];
    for (const zoneId in deliveryZones) {
        deliveryZones[zoneId].optimization.solution.routes.forEach((route: any) => {
            routes.push({
                vehicleId: route.vehicle.vehicleId,
                ruta: route.name,
                vehicles: deliveryZones[zoneId].vehicles.map((vehicle) => {
                    return {
                        id: route.vehicle.vehicleId,
                        registration: vehicle.registration,
                        idERP: vehicle.idERP,
                        user: {
                            id: vehicle.user.id,
                            name: vehicle.user.name,
                            surname: vehicle.user.surname,
                            email: vehicle.user.email,
                            idERP: vehicle.user.idERP,
                        }
                    }
                }),
                deliveryZoneId: deliveryZones[zoneId].identifier == '' ? route.name : deliveryZones[zoneId].identifier,
                associatedRoute: deliveryZones[zoneId].associatedRoute,
                deliveryPoints: route.deliveryPoints.map((dp: { [key: string]: any }) => ({
                    id: dp.identifier,
                    order: dp.order,
                    estimatedArrivalTime: dp.arrivalDayTime,
                    orderNumber: dp.orderNumber ? dp.orderNumber : '',
                    coordinates: dp.coordinates,
                    deliveryType: dp.deliveryType,
                    name: dp.name,
                    address: dp.address,
                    open: secondsToDayTimeAsString(dp.deliveryWindow.start),
                    close: secondsToDayTimeAsString(dp.deliveryWindow.end),
                })),
            });
        });
    }

    return JSON.stringify({ routes });
}

function exportToCSV(deliveryZones: {}) {
    console.log(deliveryZones);
    let csv = 'deliveryPointId;ruta;deliveryZoneId;vehicleId;order;orderNumber;estimatedArrivalTime;vehiculos';
    for (const zoneId in deliveryZones) {
        deliveryZones[zoneId].optimization.solution.routes.forEach((route: any) => {
            route.deliveryPoints.forEach((dp) => {
                const vehicles = deliveryZones[zoneId].vehicles.map((vehicle) => {
                    return {
                        id: route.vehicle.vehicleId,
                        user: {
                            id: vehicle.user.id,
                            name: vehicle.user.name,
                            surname: vehicle.user.surname,
                            email: vehicle.user.email,
                        }
                    }
                })
                //csv += `\n"${dp.identifier}";"${route.name}";"${deliveryZones[zoneId].identifier}";"${route.vehicle.vehicleId}";${dp.order};${dp.arrivalDayTime};${JSON.stringify(vehicles)}`;
                csv += `\n"${dp.identifier}";"${route.name}";"${deliveryZones[zoneId].identifier}";${route.vehicle.vehicleId};${dp.order};${dp.orderNumber};${dp.arrivalDayTime};"${JSON.stringify(vehicles)}"`;
            });
        });
    }
    return csv;
}

export function exportEvaluateds(deliveryZones: {}, format: ExportFormat) {
    switch (format) {
        case ExportFormat.CSV:
            return exportEvaluateToCSV(deliveryZones);
        case ExportFormat.JSON:
            return exportEvaluatedsToJSON(deliveryZones);
    }
}

function exportEvaluatedsToJSON(deliveryZones: {}) {
    console.log(deliveryZones);
    const Zones = [];
    for (const zoneId in deliveryZones) {

        const vehicles = [];

        if (deliveryZones[zoneId] && deliveryZones[zoneId].isMultiZone) {
            for (const zone in deliveryZones[zoneId].deliveryZones) {
                deliveryZones[zoneId].deliveryZones[zone].vehicles.forEach(element => {
                    vehicles.push(element);
                });
            }
        }

        Zones.push({
            vehicleId: deliveryZones[zoneId].isMultiZone ? vehicles[0].id : deliveryZones[zoneId].vehicles[0].id,
            vehicles: deliveryZones[zoneId].isMultiZone ? vehicles.map((vehicle) => {
                return {
                    id: vehicle.id,
                }
            }) :
                deliveryZones[zoneId].vehicles.map((vehicle) => {
                    return {
                        id: vehicle.id,
                        registration: vehicle.registration,
                        idERP: vehicle.idERP,
                        user: {
                            id: vehicle.user.id,
                            name: vehicle.user.name,
                            surname: vehicle.user.surname,
                            email: vehicle.user.email,
                            idERP: vehicle.user.idERP
                        }
                    }
                }),
            deliveryZoneId: deliveryZones[zoneId].identifier,
            associatedRoute: deliveryZones[zoneId].associatedRoute,
            deliveryPoints: deliveryZones[zoneId].deliveryPoints.map(
                (dp: { [key: string]: any }) => ({
                    id: dp.identifier,
                    order: dp.order,
                    name: dp.name,
                    estimatedArrivalTime: dp.arrivalDayTime,
                    orderNumber: dp.orderNumber ? dp.orderNumber : '',
                    coordinates: dp.coordinates,
                    deliveryType: dp.deliveryType,
                    address: dp.address,
                    open: secondsToDayTimeAsString(dp.deliveryWindow.start),
                    close: secondsToDayTimeAsString(dp.deliveryWindow.end),

                }),
            ),
        });
    }
    return JSON.stringify({ routes: Zones });
}

function exportEvaluateToCSV(deliveryZones: {}) {
    console.log(deliveryZones);
    let csv = 'deliveryPointId;deliveryZoneId;vehicleId;order;orderNumber;estimatedArrivalTime;vehiculos';
    console.log(deliveryZones);
    for (const zoneId in deliveryZones) {


        deliveryZones[zoneId].deliveryPoints.forEach((dp) => {

            let vehicles = [];
            if (deliveryZones[zoneId] && deliveryZones[zoneId].isMultiZone) {
                for (const zone in deliveryZones[zoneId].deliveryZones) {
                    deliveryZones[zoneId].deliveryZones[zone].vehicles.forEach(element => {
                        vehicles.push({
                            id: element.id
                        });
                    });
                }
            } else {
                vehicles = deliveryZones[zoneId].vehicles.map((vehicle) => {
                    return {
                        id: vehicle.id,
                        user: {
                            id: vehicle.user.id,
                            name: vehicle.user.name,
                            surname: vehicle.user.surname,
                            email: vehicle.user.email,
                        }
                    }
                })
            }

            console.log(vehicles);
            csv += `\n"${dp.identifier}";"${deliveryZones[zoneId].identifier}";"${deliveryZones[zoneId].isMultiZone ? vehicles[0].id : deliveryZones[zoneId].vehicles[0].id}";${dp.order};${dp.orderNumber};${dp.arrivalDayTime};"${JSON.stringify(vehicles)}"`;
        });
    }
    return csv;
}

export function secondsToDayTimeAsString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const response =
        String(hours < 10 ? '0' + hours : hours) +
        ':' +
        String(minutes < 10 ? '0' + minutes : minutes);
    return response;
}