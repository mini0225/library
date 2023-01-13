package com.korit.library.web.api.admin;


import com.korit.library.aop.annotation.ParamsAspect;
import com.korit.library.aop.annotation.ValidAspect;
import com.korit.library.service.BookService;
import com.korit.library.web.dto.*;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Api(tags = {"관리자용 도서관리 API"})
@RequestMapping("/api/admin")
@RestController

public class BookApi {

    @Autowired
    private BookService bookService;

    @ParamsAspect
    @ValidAspect
    @GetMapping("/books")
    public ResponseEntity<CMRespDto<List<BookMstDto>>> searchBook(@Valid SearchReqDto searchReqDto, BindingResult bindingResult){
        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(), "Successfully", bookService.searchBook(searchReqDto)));
    }


    @GetMapping("/categories")
    public ResponseEntity<CMRespDto<List<CategoryDto>>> getCategories(){
        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(), "Successfully", bookService.getCategories()));
    }

    @ParamsAspect
    @ValidAspect
    @PostMapping("/book")
    public ResponseEntity<CMRespDto<?>> registerBook(@Valid @RequestBody BookReqDto bookReqDto, BindingResult bindingResult){
        bookService.registerBook(bookReqDto);
        return ResponseEntity
                .created(null)
                .body(new CMRespDto<>(HttpStatus.CREATED.value(), "Successfully", true));
    }
    //기존자료 수정
    @ParamsAspect
    @ValidAspect
    @PutMapping("/book/{bookCode}") //PatchMapping : 비어있는 부분에 대해서는 기존값을 그대로 갖고 온다 + 수정된 애들만 업데이트  PutMapping : 비어있는부분을 null 값으로 대체 해버린다.
    public ResponseEntity<CMRespDto<?>> modifyBook(@PathVariable String bookCode, @Valid @RequestBody BookReqDto bookReqDto, BindingResult bindingResult){
        bookService.modifyBook(bookReqDto);
        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(), "Successfully", true));
    }
}
