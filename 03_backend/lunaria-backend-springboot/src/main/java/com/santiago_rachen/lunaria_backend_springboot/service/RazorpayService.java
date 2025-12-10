package com.santiago_rachen.lunaria_backend_springboot.service;

import com.razorpay.RazorpayException;
import com.santiago_rachen.lunaria_backend_springboot.io.RazorpayOrderResponse;

public interface RazorpayService {

    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
