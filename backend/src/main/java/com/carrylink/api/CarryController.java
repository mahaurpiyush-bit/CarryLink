package com.carrylink.api;
import com.carrylink.domain.*;
import com.carrylink.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class CarryController {
  private final AuthService auth; private final CarryService carry;
  @PostMapping("/auth/register") public Dtos.Auth register(@Valid @RequestBody Dtos.Register d){return auth.register(d);}
  @PostMapping("/auth/login") public Dtos.Auth login(@Valid @RequestBody Dtos.Login d){return auth.login(d);}
  @PostMapping("/trips") public Trip trip(@Valid @RequestBody Dtos.CreateTrip d){return carry.createTrip(d);}
  @GetMapping("/trips") public List<Trip> trips(){return carry.myTrips();}
  @GetMapping("/trips/available") public List<Dtos.TravellerTrip> availableTrips(){return carry.availableTravellerTrips();}
  @PostMapping("/requests") public DeliveryRequest request(@Valid @RequestBody Dtos.CreateRequest d){return carry.createRequest(d);}
  @GetMapping("/requests") public List<DeliveryRequest> requests(){return carry.myRequests();}
  @GetMapping("/requests/matching-me") public List<Dtos.MatchingRequest> matchingRequests(){return carry.matchingRequestsForTraveller();}
  @GetMapping("/requests/{id}/matches") public List<Dtos.Match> matches(@PathVariable Long id){return carry.matches(id);}
  @GetMapping("/bookings") public List<Booking> bookings(){return carry.myBookings();}
  @PostMapping("/bookings") public Booking book(@Valid @RequestBody Dtos.BookingCreate d){return carry.book(d);}
  @PatchMapping("/bookings/{id}/accept") public Booking accept(@PathVariable Long id){return carry.accept(id);}
  @PatchMapping("/bookings/{id}/status") public Booking status(@PathVariable Long id,@Valid @RequestBody Dtos.StatusChange d){return carry.changeStatus(id,d.status());}
  @PatchMapping("/bookings/{id}/cancel") public Booking cancel(@PathVariable Long id){return carry.cancel(id);}
  @PostMapping("/bookings/{id}/proof") public Booking proof(@PathVariable Long id,@Valid @RequestBody Dtos.DeliveryProof d){return carry.addDeliveryProof(id,d);}
  @PostMapping("/bookings/{id}/payment") public Payment payment(@PathVariable Long id,@Valid @RequestBody Dtos.PaymentCreate d){return carry.pay(id,d);}
  @PostMapping("/bookings/{id}/reports") public Report report(@PathVariable Long id,@Valid @RequestBody Dtos.ReportCreate d){return carry.report(id,d);}
  @GetMapping("/bookings/{id}/messages") public List<ChatMessage> messages(@PathVariable Long id){return carry.messages(id);}
  @PostMapping("/bookings/{id}/messages") public ChatMessage message(@PathVariable Long id,@Valid @RequestBody Dtos.ChatCreate d){return carry.message(id,d);}
  @PostMapping("/bookings/{id}/reviews") public Review review(@PathVariable Long id,@Valid @RequestBody Dtos.ReviewCreate d){return carry.review(id,d);}
  @GetMapping("/admin/reports") public List<Report> reports(){return carry.openReports();}
  @GetMapping("/profile") public User profile(){return carry.profile();}
  @PatchMapping("/admin/reports/{id}") public Report review(@PathVariable Long id,@Valid @RequestBody Dtos.ReportStatusChange d){return carry.reviewReport(id,d.status());}
}
