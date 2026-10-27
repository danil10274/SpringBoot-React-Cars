
package com.example.cars;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CarsApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarsApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(CarRepository repository) {
        return args -> {
            repository.save(new Car("Toyota Corolla"));
            repository.save(new Car("Honda Civic"));
            repository.save(new Car("Mazda MX-5"));
            repository.save(new Car("Ford Mustang"));
            repository.save(new Car("Tesla Model 3"));
            repository.save(new Car("BMW M3"));
        };
    }
}
