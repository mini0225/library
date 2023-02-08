package com.korit.library.web.api;


import com.korit.library.repository.BookRepository;
import com.korit.library.security.PrincipalDetails;
import com.korit.library.service.LikeService;
import com.korit.library.web.dto.CMRespDto;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Delete;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class LikeApi {

    private final LikeService likeService;

    @PostMapping("/book/{bookId}/like")
    public ResponseEntity<CMRespDto<Integer>> like(@PathVariable int bookId, @AuthenticationPrincipal PrincipalDetails principalDetails) { //PrincipalDetails principalDetails 로그인중인 사용자의 정보
        //현재 로그인 중인 사용자의 like를 갖고 와야함.

        int likeCount = likeService.like(bookId, principalDetails.getUser().getUserId());

        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(),"Successfully", likeCount));

    }

    @DeleteMapping("/book/{bookId}/like")
    public ResponseEntity<CMRespDto<Integer>> dislike(@PathVariable int bookId, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        //현재 로그인 중인 사용자의 dislike를 갖고 와야함.

        int likeCount = likeService.dislike(bookId, principalDetails.getUser().getUserId());

        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(),"Successfully", likeCount));

    }
}
