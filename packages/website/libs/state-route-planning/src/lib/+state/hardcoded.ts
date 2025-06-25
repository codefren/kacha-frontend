import { RoutePlanningState } from './route-planning.state';

export const initialAlreadyOptimizedZones: RoutePlanningState = {
    deliveryZonesStatus: {
        2450: {
            selected: true,
            expanded: false,
            expandedSettings: false,
            expandedPoints: false,
            expandedRoutes: false,
            expandedRoutesSettings: false,
            optimized: true,
            evaluated: false,
            displayed: false,
            dirty: false,
            activeRoute: 907,
        }
    },
    routesStatus: {
        2450: {
            907: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2451: {
            905: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2452: {
            902: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
            903: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2453: {
            906: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2454: {
            908: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2455: {
            901: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2456: {
            909: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
        2457: {
            904: {
                selected: true,
                displayed: true,
                evaluating: false,
                recomputing: false,
                progress: 0,
            },
        },
    },
    optimizationStatus: {
        2450: { loading: false, progress: 78, state: null },
        2451: { loading: false, progress: 0, state: null },
        2452: { loading: false, progress: 0, state: null },
        2453: { loading: false, progress: 0, state: null },
        2454: { loading: false, progress: 93, state: null },
        2455: { loading: false, progress: 0, state: null },
        2456: { loading: false, progress: 93, state: null },
        2457: { loading: false, progress: 0, state: null },
    },
    showSelected: false,
    sidenavOpened: true,
    simulating: 'None',
    highlightedRoute: -1,
    simulationVelocity: null,
    simulationTime: null,
    selectedDeliveryPoint: -1,
    hoveredDeliveryPoint: -1,
    useRouteColors: true,
    showOnlyOptimizedZones: true,
    hoveredZone: -1,
    routeShowGeometry: 0,
    zoneShowGeometry: 0,
    ShowGeometry: false,
    depotOpened: false,
    planningSession: {
        depotPoint: {
            address: 'Dispoll',
            coordinates: { latitude: 41.3246811, longitude: 2.0372949 },
        },
        id: 245,
        deliveryZones: {
            2450: {
                name: 'Alan Olson',
                color: '#E65100',
                useDefaultSettings: true,
                id: 2450,
                identifier: 'BCN-EST',
                sessionId: 245,
                settings: {
                    forceDepartureTime: false,
                    ignoreCapacityLimit: false,
                    useAllVehicles: false,
                    explorationLevel: 5,
                    deliverySchedule: {},
                    settingsUseSkills: true,
                    optimizationParameters: {
                        preference: {
                            numVehicles: 100,
                            travelDistance: 100,
                            customerSatisfaction: 100,
                            vehicleTimeBalance: 100,
                        },
                    },
                },
                vehicles: [
                    {
                        id: 11,
                        name: 'Unbranded Vista',
                        capacity: 2018,
                        deliveryZoneId: 'BCN-EST',
                    },
                    {
                        id: 15,
                        name: 'redundant PCI',
                        capacity: 1190,
                        deliveryZoneId: 'BCN-EST',
                    },
                    {
                        id: 23,
                        name: 'Practical tan',
                        capacity: 1128,
                        deliveryZoneId: 'BCN-EST',
                    },
                ],
                deliveryZones: {},
                deliveryPoints: [
                    {
                        address: '41.383369,2.131082',
                        name: 'REBOST IBERIC',
                        demand: 18,
                        serviceTime: 244,
                        priority: 1,
                        deliveryNotes:
                            'Dignissimos aut quos sed dignissimos quis harum et iste aliquam. Accusamus quos odit nisi accusantium cum. Nisi sunt molestiae et animi. Quae quas corrupti dolores doloribus voluptatem molestias.',
                        id: 46181,
                        identifier: '6',
                        order: 1,
                        coordinates: { latitude: 41.383369, longitude: 2.131082 },
                        deliveryWindow: { start: 27490 },
                        volumetric: 0
                    },
                    {
                        address: '41.420232,2.18919',
                        name: 'PERIPHERAL SYSTEMS IBERICA',
                        demand: 21,
                        serviceTime: 254,
                        priority: 1,
                        deliveryNotes:
                            'Voluptatem hic reiciendis omnis et voluptatem doloremque. Praesentium fugiat sapiente tempora. Id consequuntur nostrum qui pariatur.',
                        id: 46255,
                        identifier: '80',
                        order: 8,
                        coordinates: { latitude: 41.420232, longitude: 2.18919 },
                        deliveryWindow: { start: 27862 },
                        volumetric: 0
                    },
                    {
                        address: '41.413194,2.134379',
                        name: 'RESTAURANT EL ASADOR DE ARANDA',
                        demand: 1,
                        serviceTime: 240,
                        priority: 1,
                        deliveryNotes:
                            'Et et rerum est voluptatem in odit mollitia provident doloribus. Quidem necessitatibus aspernatur nam in. Molestias labore enim id nam assumenda. Sit officiis quas vel. Sed non sed exercitationem mollitia enim architecto.',
                        id: 46260,
                        identifier: '85',
                        order: 9,
                        coordinates: { latitude: 41.413194, longitude: 2.134379 },
                        deliveryWindow: { start: 25970, end: 32171 },
                        volumetric: 0
                    },
                    {
                        address: '41.38004,2.179578',
                        name: 'FARMACIA JOAN LLUIS PUJOL',
                        demand: 46,
                        serviceTime: 67,
                        priority: 1,
                        deliveryNotes:
                            'Quibusdam adipisci esse explicabo corrupti nesciunt qui incidunt natus. Rem magni soluta asperiores ullam fugiat consequatur dolor excepturi. Ducimus velit maxime. Est ducimus libero beatae in inventore et. Quod nihil consectetur dolorem mollitia. Non vero atque culpa aspernatur.',
                        id: 46264,
                        identifier: '89',
                        order: 10,
                        coordinates: { latitude: 41.38004, longitude: 2.179578 },
                        deliveryWindow: { start: 27568, end: 28857 },
                        volumetric: 0
                    },
                ],
                isMultiZone: false,
                optimization: {
                    solution: {
                        id: 812,
                        type: 'optimization',
                        routes: [
                            {
                                id: 907,
                                geometry:
                                    '_gf{Fa{lKlJfNPN^e@lCoDDINKL@D?BAFEHKDM@IAYl@mAf@s@jCkDfCkDdA{AZa@VS^U`@?\\HPPJj@@l@Kb@SX]L[A_@S{@s@eAwAaCmDoEwG}A}BuK_PyEeHwBiDiAsBsAeC_C_FqBgEoDoHoC{FcDcHmCaGyB}E}AyDmAmEw@oEo@oFMcE?wGFgDBsJHmHDaG?_DK{CMgCWgCYsB_@qB[cB{A_G{AuFcBeGkDqMiCsJwAiFoAeEq@oBaAkCaAsBgAwBuAaCiBkCeAsA}AgBaBcBeB}AoAcAy@i@w@g@oBiA{@_@w@_@qAg@MGw@YsAa@y@W_AUuAY{AYaBUgAIoAIyBEw@A_A?_A@kAByALmCXyCl@gDz@gBl@iAb@uAl@kFrCeAh@mE|By@^u@`@y@\\w@Xy@Ty@Rs@F_@LyAP{AHyA?eAEoAIk@Gm@Ik@Mk@Ms@Sa@I_E}@_Ey@qBa@uCo@{IiBkCk@_AU}@UkAe@kAi@y@e@u@g@{@q@y@s@oAiAu@q@u@m@cAs@gAq@{@c@_A_@u@UsDy@gCi@WG_DcAwB}@{A{@kBmAe@]wAmAcAgA_AkAcA{AqBeDiAgBeB{B_B_BkC}BcBwAiGkFiA_A_CgB{AkAy@m@aBoAq@c@}CgCuFwEmCkBkBqAcCmA_@O_C_AsB}@q@YyAi@aIcDgDwAiE}AuCyA}@g@sCsC{A_B{DuCyAcAq@]sAUgD]g@I]Ci@G_@G]K{Ao@wBgBm@q@_EmESUcCmC{CeDw@}@[a@[a@Sc@eA_CsBiFg@iAkD}F]i@mAcBgBgBs@m@{A_BcCoD{@oBY_@[Y_@q@EIKOSM?AAAAAAA?CAACAA?Ek@gCoG}BaEoFyHq@}@WU{@g@QK_@_@GKO]Qm@Y{AE[c@wCGgAS}CAU?EROHE\\UDCrA}@pAy@`@|@Xj@PGxCoBJO@SAQGKe@g@KMNKjDwB|CoBt@e@Pb@`@BtAk@TYJg@fFwBrEsBlGiCpB}@j@a@\\a@i@o@X_BXcBXyAF_@Hg@q@yCCSe@kCEUKw@Ea@Ga@Ea@ASAGc@wE?UAg@Cm@M_CEs@Ac@CgAIiAEYMu@EUSk@IYS_@u@uAEEsDeEq@y@_@e@IMUa@]{@e@yAc@eBEQGSoAaFKg@CKc@}Ae@eBOa@MUSg@KSm@eA_A}ApAwAnCkCxCqCr@w@h@g@XYX[\\]|@cAFEj@i@~A}AjCmC`C{BbBcBOYiAwBcAoBx@u@TKH?HJl@fABDd@x@DFLO`AuArByCvB_DBEDEj@w@zBcDf@s@X^RXX`@d@r@b@l@\\b@z@jANRd@r@Zd@BDX`@jBnCb@l@DF\\f@h@z@x@jAb@n@X`@JJt@fAd@r@TZNR\\g@h@y@FIJQLOPWFKV]JOJO|BiD\\g@DGZc@hBmC^k@`@k@r@cAv@eAZe@\\g@jBmC@C^i@d@o@l@{@v@iA^k@DET]x@kAl@{@DGZe@DE^k@tAoB`@m@LQBEDENUJQDEDGRYT_@vAuB`@o@^k@zA}BZe@T]r@aANSLSnEgG`@i@f@}@R[Va@^i@\\e@l@}@`CgDt@iArByCnBuCFI`@i@JL`@h@r@z@Zb@v@hAb@p@RVP[Xa@RYd@k@x@gAHB\\JXLd@dBz@f@l@\\b@_BX}@n@mDVcA`@iABK~@d@l@VNH`Ap@r@b@j@ZbAh@VeAPo@No@jA|@dAv@fBrAlA~@DD@@NJNJNj@NXHHTJ^DXI^TDBpBzAZTNLPRHZ@f@AR@RDXGREJEJEFABEFGNELELEPAR?PAJ?J?LCp@K`EA\\ALATAl@ANAl@ANGvBCp@?B?D?JItCEvBAT?P?FAPAr@?P?J?bAA`DA`B?J?LMDEFONWb@{AzBQT[b@GJKNU^a@j@w@lAm@z@QVgBfCo@`AEDsBrC]d@W^OR}BdDY`@{AxBmAdB_@h@kCxDuCfEKNCBEFABKNQTCDCDSXoBtC_@h@EF[d@gBdC]b@EB_@l@gBjC_@j@c@p@c@n@INQRu@dAQVaAtAeA|A?@a@f@a@f@oAlBW^]h@GH]f@eBhC_@f@_@j@iBjCa@h@g@v@]h@_AtAEFMt@AX?HCVo@xHCJOdCg@bGKlBGb@ALAFc@dFMzAOlBr@Xl@PX\\^r@vAzCHPpAdCXp@vCnF`ArBfAvBHRNZl@pALXp@vAFJdA|B`A|BfAvBl@bAHNT^P\\lBdDxBrDFJpAi@d@SZMhBq@hC}@vGyBCI}@}Ei@qCa@{AWaA[uA_AyC_BcG[iAW{@Uq@IUm@{A`@g@x@aAl@w@PS`@e@LOHM@ABCjFiHBEP[l@eAHe@DYBc@Bg@?e@Ca@C_@]_Ak@aBwAmEa@wACKISWeA[cAs@yB}B_H{ByGCGyBwGUw@KMmBoCU]uCaEKQIIc@m@m@{@yAuB}CgFoDeFgD}EeDcFGKgDuEeFkHEIKMqAmBIKiBiCS[U[gBeCy@kAc@k@]k@mAkB[e@_@k@]g@kBqC_@i@]g@Ya@w@gAY_@W_@CECC_@i@s@eAu@kAc@k@[g@cCoDEEGGqB}CYe@UYKQW]_@k@OSm@{@SYQYk@w@qAmBKM]g@EG]g@cA{Ag@u@_@i@CCWa@e@s@wAwB[c@EG_@i@qAgBW]_@g@_@k@_B_C_@k@]i@u@gAi@w@g@s@[g@cBmCCEW_@CE]i@kAgBa@m@Ye@a@k@mCaEsB{CqC}DkAcBu@gAkAcBSYMQc@k@aABmAAuC?s@AcG?wA?Y?kF?O?mAAwB?gB?mB?yB?{BCuG@Y?m@?q@?SS{BkDd@w@j@w@h@w@r@cAV[p@{@@Cu@_@oAi@gBmA]h@{BbDEpAkCDEj@Cx@QlDEhA@ZG?k@AcA@s@De@B_AL_ARm@Nc@N[L[LeAh@e@XwCbB_B~@cB`Ao@^qC~AYRkC|AiC`BEBWPAh@?f@Af@?b@ArA?l@AzDCzD?z@ApBAnDCtCuBAuBCy@AICYSsBsA{@m@OKSOEEIIcAy@a@_@[a@W_@MOOO_@UMIOGiA]_@I]IsD}@KAcBc@uBi@]I]Kq@QsBw@YQkCaBIG_@YW[@F@XHxATfEBXK@_BJoDXkBmCkCcDLULWRWJOHJ|BbDw@hAkCcDLULWRWJO|@kAbCkD@EJOGIQSeDgEkCeDgAsACCIK@ILoA`@FpAVrAZnFhAvAZr@NrHfBtHfBx@R`Cj@VF~D~@dAVnBd@pBd@lCn@`ATRDj@JbAFd@Ab@Eh@IVGXSLK`@WXOBCbCcBf@[jBgAROjAm@nAw@t@c@`E_CxCeBd@Wb@Uz@a@`@Q`@Mt@Sh@Kp@Il@I`@Al@An@Al@BJ?\\?vAA`B?n@?`A?jB?h@?x@?R?dC?dC?h@?xA?jC@V?X?rI@RAxD@tA@H?rI?l@@LXzAzBp@dApAhBPVnAhBdBfCrBxCtBzCfCrDh@t@^j@x@lAn@|@\\h@BBZd@j@x@FHn@~@`@j@`@j@v@jAp@`AZb@T\\t@lAV`@V^`@p@d@q@?A`BeC\\g@_@k@_B_C_@k@]h@qBrCSZT\\t@lAV`@V^`@p@^j@TZv@fALTBB`@j@BFV^|AzBb@n@DD\\h@`@j@d@n@\\h@`@l@^h@_@j@m@|@{@pAYb@A@CDa@h@gBhC[f@c@l@A@m@|@NT^l@b@r@HJx@rALRNU`@m@`@k@d@o@bBeC^k@`@j@`BbCb@l@b@p@rAlBXd@V`@LRDDDFX`@rAnB^h@BGZc@j@y@HOBEV_@NQFMNSNU`@l@p@~@v@jAb@l@@BZd@hBjC\\f@`@j@hBlC^h@d@r@dA|A\\f@^f@^j@|@pA@?t@fAh@t@FHLPHLJLdBhCDF~A~BHNDDjBnCtB|CvB`Dj@x@FHdD|EjDzEnDjF`DzEfCrDb@j@Zb@JLV^rBpCfDdF`D`FDFbDxE\\e@^e@JOBC~AcCfCsD`@i@^h@hBhC`@n@^f@dBdCZh@FHZ`@jBlC^j@^j@f@t@z@tA\\p@tCgEPWV]d@s@^k@NSZa@RYTWZSLOZa@b@k@PKD?N@Z@?@HRJNLJNFHBH?J?PCHEHERXFHr@|@`@h@^f@jBhCBDj@t@h@x@XRNRHJBDTXtCfENTPVvB~CRZTZpBtCf@v@LPX`@bAzAV\\p@`Ab@n@x@lA~@rAhBjCRXV^@B@@LPBFLNb@n@b@|@n@|@nJjNj@|@`BfCzClEJNnBjCjCpDpBfCzA~Bt@~@lC|DtDvFlElGfCvDxLhQ`@l@zBdDx@nAn@`AvGtJlAjBpAhBjAtBlChFxD~FrBfD`EjFn@~@`BbCd@p@zCpEjA~Ah@|@tBzCx@jANR`CnDtDjF|SzZzEdHb@l@|DfGt@bAb@r@xArBtAtBt@pAVb@hAvBzAxDL`@n@vBtAhGtDdOdClKpBlIjA`Fv@nC`@hAdAfD\\fATx@VhAJh@Jt@Hz@Ft@FrB?|AGvB_AvNc@rG]~Ei@`HQ~B_@hFMrB_ArMa@pFMbBYdECpA?rC?fG?dECrDIxBSzCa@|Cg@nCi@jCw@rDYfBUvBm@~GKzAq@bKEj@GTQREDEDEDCHENAP@RBNHLHJJDJ@LAFCHEHKDMBO@QAKCKCKEICg@@YFYJYPYNURMVIPKRITQRUJ[FSFc@PaBRw@R]NSNMl@[ZM\\I\\E`@Cf@AX@\\D^Bf@Lf@Jj@Z~@|@`CpDjAbCnC~FlDnHpBpE`CxEnA~BfAlB`CxDtE`HrK|O`B`CjDdGl@vAT`AHnA?hAS|AYz@{BtDg@r@_Ar@KEI?E@E@EBILCFAP?HId@CBmDzEmJgN',
                                vehicleId: 2094,
                                departureDayTime: 25020,
                                travelTimeToFirst: 960,
                                travelDistanceToFirst: 15952,
                                name: 'Alan Olson-1',
                                color: '#E65100',
                                solutionId: 812,
                                settings: {
                                    optimizeFromIndex: 1,
                                    forceDepartureTime: false,
                                    ignoreCapacityLimit: false,
                                    useAllVehicles: false,
                                    explorationLevel: 5,
                                    deliverySchedule: { start: null, end: null },
                                    settingsUseSkills: false,
                                    optimizationParameters: {
                                        preference: {
                                            numVehicles: 100,
                                            travelDistance: 100,
                                            customerSatisfaction: 100,
                                            vehicleTimeBalance: 100,
                                        },
                                    },
                                },
                                deliveryPoints: [
                                    {
                                        address: '41.413194,2.134379',
                                        name: 'RESTAURANT EL ASADOR DE ARANDA',
                                        demand: 1,
                                        serviceTime: 240,
                                        priority: 1,
                                        deliveryNotes:
                                            'Et et rerum est voluptatem in odit mollitia provident doloribus. Quidem necessitatibus aspernatur nam in. Molestias labore enim id nam assumenda. Sit officiis quas vel. Sed non sed exercitationem mollitia enim architecto.',
                                        id: 17601,
                                        identifier: '85',
                                        travelDistanceToNext: 3454,
                                        travelTimeToNext: 360,
                                        vehicleWaitTime: 0,
                                        order: 1,
                                        coordinates: {
                                            latitude: 41.413194,
                                            longitude: 2.134379,
                                        },
                                        deliveryWindow: { start: 25970, end: 32171 },
                                        arrivalDayTime: 25980,
                                        customerWaitTime: 10,
                                        delayTime: 0,
                                        isServicedLate: false,
                                        volumetric: 0
                                    },
                                ],
                                vehicle: {
                                    id: 2094,
                                    name: 'Unbranded Vista',
                                    capacity: 2018,
                                    inputId: 813,
                                    vehicleId: null,
                                    userId: 1
                                },
                                travelTime: 5220,
                                travelDistance: 65170,
                                vehicleWaitTime: 7260,
                                customerWaitTime: 8911,
                                delayTime: 0,
                                deliveryPointsServicedLate: 0,
                                time: 14721,
                                depotArrivalDayTime: 39741,
                            },
                        ],
                        totalTime: 14721,
                        totalTravelTime: 5220,
                        totalCustomerWaitTime: 8911,
                        totalVehicleWaitTime: 7260,
                        totalDelayTime: 0,
                        totalTravelDistance: 65170,
                        totalDeliveryPointsServicedLate: 0,
                        avgCustomerWaitTime: 891,
                        avgDelayTime: 0,
                    },
                },
            }
        },
    },
    loadingPlanningSession: false,
    loadedPlanningSession: true,
    viewingMode: 0,
};
