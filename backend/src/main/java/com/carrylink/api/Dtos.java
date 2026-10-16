package com.carrylink.api;

import com.carrylink.domain.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public final class Dtos {
  private Dtos() {}
  public record Register(@NotBlank String name,@Email @NotBlank String email,@NotBlank String phone,@Size(min=8) String password,@NotNull Role role) {}
  public record Login(@Email @NotBlank String email,@NotBlank String password) {}
  public record Auth(String token, Long userId, String name, Role role) {}
  public record Stop(@NotBlank String location,@NotNull Instant expectedArrival,@NotNull Instant expectedDeparture) {}
  public record CreateTrip(@NotBlank String origin,@NotBlank String destination,@NotNull Instant departureTime,@NotNull Instant expectedArrivalTime,@NotNull TransportType transportType,@Positive double totalCapacity,@NotBlank String pickupPoint,@NotBlank String dropPoint,@NotEmpty List<Stop> stops) {}
  public record CreateRequest(@NotBlank String origin,@NotBlank String destination,@NotBlank String pickupPoint,@NotBlank String dropPoint,@NotNull ItemCategory itemCategory,@NotBlank String description,@Positive @Max(20) double weight,String dimensions,@NotNull Instant requiredBy,@Positive double offeredAmount) {}
  public record BookingCreate(@NotNull Long requestId,@NotNull Long tripId) {}
  public record StatusChange(@NotNull BookingStatus status) {}
  public record PaymentCreate(@NotBlank String idempotencyKey) {}
  public record ReportCreate(@NotBlank @Size(max=2000) String description) {}
  public record ReportStatusChange(@NotNull ReportStatus status) {}
  public record ChatCreate(@NotBlank @Size(max=1000) String body) {}
  public record ReviewCreate(@Min(1) @Max(5) int rating,@NotBlank @Size(max=1000) String comment) {}
  public record DeliveryProof(@NotBlank @Size(max=120) String receiverName,@NotBlank @Size(max=1000) String note) {}
  public record Match(Long tripId,String traveller,String origin,String destination,double availableCapacity,Instant departureTime,Instant arrivalTime,int routeScore,TransportType transportType,String pickupPoint,String dropPoint,double rating) {}
  public record TravellerTrip(Long tripId,String traveller,String origin,String destination,double availableCapacity,Instant departureTime,Instant arrivalTime,TransportType transportType,String pickupPoint,String dropPoint,double rating,int completedTrips) {}
  public record MatchingRequest(Long id,Long tripId,String sender,String origin,String destination,String pickupPoint,String dropPoint,String description,double weight,String dimensions,Instant requiredBy,double offeredAmount,RequestStatus status) {}
}
