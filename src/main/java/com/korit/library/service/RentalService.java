package com.korit.library.service;

import com.korit.library.entity.RentalDtl;
import com.korit.library.entity.RentalMst;
import com.korit.library.exception.CustomRentalException;
import com.korit.library.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    //누가빌리냐
    public void rentalOne(int userId, int bookId){

        availability(userId);
        availabilityLoan(bookId);
        //위 두개가 통과해야 아래 실행.

        RentalMst rentalMst = RentalMst.builder()
                .userId(userId)
                .build();

        rentalRepository.saveRentalMst(rentalMst);

        List<RentalDtl> rentalDtlList = new ArrayList<>();

        RentalDtl rentalDtl = RentalDtl.builder()
                .rentalId(rentalMst.getRentalId())
                .bookId(bookId)
                .build();

        rentalDtlList.add(rentalDtl);

        rentalRepository.saveRentalDtl(rentalDtlList);

    }

    public void returnBook(int bookId){
        notAvailabilityLoan(bookId);
        rentalRepository.updateReturnDate(bookId);
    }

    private void availability(int userId) {
        //대여 가능한가 확인
        int rentalCount = rentalRepository.rentalAvailability(userId);
        if(rentalCount > 2 ) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("rentalCountError", "대여 횟수를 초과 하였습니다.");
            throw new CustomRentalException(errorMap);
        }
    }

    private void availabilityLoan(int bookId){
        int loanCount = rentalRepository.loanRental(bookId);
        if(loanCount >0){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("loanError", "현재 대여중인 도서입니다.");
            throw new CustomRentalException(errorMap);
        }
    }

    private void notAvailabilityLoan(int bookId){
        int loanCount = rentalRepository.loanRental(bookId);
        if(loanCount < 1){
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("loanError", "대여가능한 도서입니다.");
            throw new CustomRentalException(errorMap);
        }
    }
}
