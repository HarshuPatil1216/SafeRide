package com.saferide.config;

import com.saferide.entity.Parent;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.entity.User;
import com.saferide.enums.Role;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
import com.saferide.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String DEMO_PARENT_EMAIL =
            "parent1@saferide.com";

    private static final String DEMO_ROUTE_NAME =
            "Pune Station - SafeRide School";

    // ==========================================
    // DEMO LOGIN USERS
    // ==========================================

    private static final String ADMIN_EMAIL =
            "admin@saferide.school";

    private static final String ADMIN_PASSWORD =
            "adminPassword123";

    private static final String DRIVER_EMAIL =
            "driver@saferide.school";

    private static final String DRIVER_PASSWORD =
            "driverPassword123";

    private static final String PARENT_EMAIL =
            "parent@saferide.school";

    private static final String PARENT_PASSWORD =
            "parentPassword123";

    // ==========================================
    // REPOSITORIES
    // ==========================================

    private final ParentRepository parentRepository;
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            ParentRepository parentRepository,
            RouteRepository routeRepository,
            StopRepository stopRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.parentRepository = parentRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // MAIN SEEDER
    // ==========================================

    @Override
    @Transactional
    public void run(String... args) {

        // Create login users
        seedUsers();

        // Existing demo parent
        seedParent();

        // Existing route
        Route route = seedRoute();

        // Existing stops
        seedStops(route);

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "SafeRide Data Seeding Completed"
        );

        System.out.println(
                "=========================================="
        );
    }

    // ==========================================
    // USER SEEDING
    // ==========================================

    private void seedUsers() {

        // ------------------------------------------
        // ADMIN
        // ------------------------------------------

        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {

            User admin = new User();

            admin.setFullName("SafeRide Admin");
            admin.setEmail(ADMIN_EMAIL);

            admin.setPassword(
                    passwordEncoder.encode(ADMIN_PASSWORD)
            );

            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println(
                    "✅ Admin user created: "
                            + ADMIN_EMAIL
            );
        } else {

            System.out.println(
                    "ℹ️ Admin user already exists: "
                            + ADMIN_EMAIL
            );
        }

        // ------------------------------------------
        // DRIVER
        // ------------------------------------------

        if (!userRepository.existsByEmail(DRIVER_EMAIL)) {

            User driver = new User();

            driver.setFullName("SafeRide Driver");
            driver.setEmail(DRIVER_EMAIL);

            driver.setPassword(
                    passwordEncoder.encode(DRIVER_PASSWORD)
            );

            driver.setRole(Role.DRIVER);

            userRepository.save(driver);

            System.out.println(
                    "✅ Driver user created: "
                            + DRIVER_EMAIL
            );
        } else {

            System.out.println(
                    "ℹ️ Driver user already exists: "
                            + DRIVER_EMAIL
            );
        }

        // ------------------------------------------
        // PARENT
        // ------------------------------------------

        if (!userRepository.existsByEmail(PARENT_EMAIL)) {

            User parentUser = new User();

            parentUser.setFullName("SafeRide Parent");
            parentUser.setEmail(PARENT_EMAIL);

            parentUser.setPassword(
                    passwordEncoder.encode(PARENT_PASSWORD)
            );

            parentUser.setRole(Role.PARENT);

            userRepository.save(parentUser);

            System.out.println(
                    "✅ Parent user created: "
                            + PARENT_EMAIL
            );
        } else {

            System.out.println(
                    "ℹ️ Parent user already exists: "
                            + PARENT_EMAIL
            );
        }
    }

    // ==========================================
    // DEMO PARENT
    // ==========================================

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

    // ==========================================
    // ROUTE
    // ==========================================

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

    // ==========================================
    // STOPS
    // ==========================================

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

    // ==========================================
    // CREATE STOP IF MISSING
    // ==========================================

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