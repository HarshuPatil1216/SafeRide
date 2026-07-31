package com.saferide.config;

import com.saferide.entity.Parent;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String DEMO_PARENT_EMAIL =
            "parent1@saferide.com";

    private static final String DEMO_ROUTE_NAME =
            "Pune Station - SafeRide School";

    private final ParentRepository parentRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;

    public DataSeeder(
            ParentRepository parentRepository,
            RouteRepository routeRepository,
            StopRepository stopRepository
    ) {
        this.parentRepository = parentRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        seedParent();

        Route route = seedRoute();

        seedStops(route);
    }

    private void seedParent() {

        boolean parentExists = parentRepository
                .findAll()
                .stream()
                .anyMatch(parent ->
                        DEMO_PARENT_EMAIL.equalsIgnoreCase(
                                parent.getEmail()
                        )
                );

        if (parentExists) {
            return;
        }

        Parent parent = new Parent();
        parent.setFullName("Demo Parent");
        parent.setEmail(DEMO_PARENT_EMAIL);
        parent.setPhone("9876543210");
        parent.setAddress("Pune, Maharashtra");
        parent.setActive(true);

        parentRepository.save(parent);
    }

    private Route seedRoute() {

        return routeRepository
                .findAll()
                .stream()
                .filter(route ->
                        DEMO_ROUTE_NAME.equalsIgnoreCase(
                                route.getRouteName()
                        )
                )
                .findFirst()
                .orElseGet(() -> {

                    Route route = new Route();

                    route.setRouteName(DEMO_ROUTE_NAME);
                    route.setSource("Pune Station");
                    route.setDestination("SafeRide School");
                    route.setDistanceInKm(12.5);
                    route.setEstimatedDurationInMinutes(35);
                    route.setActive(true);

                    return routeRepository.save(route);
                });
    }

    private void seedStops(Route route) {

        createStopIfMissing(
                route,
                "Pune Station",
                "Pune Railway Station, Pune",
                18.5286,
                73.8743,
                1,
                0
        );

        createStopIfMissing(
                route,
                "Shivajinagar",
                "Shivajinagar Bus Stand, Pune",
                18.5308,
                73.8475,
                2,
                15
        );
    }

    private void createStopIfMissing(
            Route route,
            String stopName,
            String address,
            Double latitude,
            Double longitude,
            Integer stopOrder,
            Integer estimatedArrivalMinutes
    ) {

        boolean stopExists = stopRepository
                .findAll()
                .stream()
                .anyMatch(stop ->
                        stop.getRoute().getId().equals(route.getId())
                                && stopName.equalsIgnoreCase(
                                stop.getStopName()
                        )
                );

        if (stopExists) {
            return;
        }

        Stop stop = new Stop();

        stop.setStopName(stopName);
        stop.setAddress(address);
        stop.setLatitude(latitude);
        stop.setLongitude(longitude);
        stop.setStopOrder(stopOrder);
        stop.setEstimatedArrivalMinutes(
                estimatedArrivalMinutes
        );
        stop.setActive(true);
        stop.setRoute(route);

        stopRepository.save(stop);
    }
}