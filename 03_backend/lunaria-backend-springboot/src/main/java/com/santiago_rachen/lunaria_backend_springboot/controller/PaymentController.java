package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.razorpay.RazorpayException;
import com.santiago_rachen.lunaria_backend_springboot.io.SaleResponse;
import com.santiago_rachen.lunaria_backend_springboot.io.PaymentRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.PaymentVerificationRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.RazorpayOrderResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.SaleService;
import com.santiago_rachen.lunaria_backend_springboot.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final SaleService saleService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        return razorpayService.createOrder(request.getAmount(), request.getCurrency());
    }

    @PostMapping("/verify")
    public SaleResponse verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return saleService.verifyPayment(request);
    }
}
