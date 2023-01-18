package com.korit.library.web.api;


import com.korit.library.security.PrincipalDetails;
import com.korit.library.service.RentalService;
import com.korit.library.web.dto.CMRespDto;
import io.swagger.annotations.Api;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = {"도서 대여 API"})
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RentalApi {
    /*
        /rental/{bookId}
        대여요청시 검사해야할 것.
        -> 대여요청 날린 사용자의 대여가능 여부 확인
            ->(가능)  대여 가능 횟수(3권 미만일 때) -> 대여 정보 추가(rental_mst(대여코드) + 그에 따른 rental_dtl)
            ->(불가능) 대여 가능 횟수 0 (or 원하는 책이 대여중??) -> 예외처리
    */
    private final RentalService rentalService; //@RequiredArgusConstructor(필수생성자) + final = @Autowired, final 필수

    @PostMapping("/rental/{bookId}")
    public ResponseEntity<CMRespDto<?>> rental(@PathVariable int bookId, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        rentalService.rentalOne(principalDetails.getUser().getUserId(),bookId);
        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(),"Successfully", null));
    }
}
