/*
        REPOSITORY 구성
        C(create) : 도서등록
        R(read) : 1. 도서 전체 조회(ㄱ. 전체 조회 , ㄴ. 20개씩 가져 오기)
                      1) 도서 검색
                        ㄱ) 도서코드
                        ㄴ) 도서명
                        ㄷ) 저자
                        ㄹ) 출판사
                      2) 카테고리
                 2. 도서코드로 조회
        U(update) : 도서수정
        D(delete) : 도서삭제

    */

package com.korit.library.repository;


import com.korit.library.web.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface BookRepository {
    public List<BookMstDto> searchBook(SearchReqDto searchReqDto);
    public BookMstDto findBookByBookCode(String bookCode);
    public List<CategoryDto> findAllCategory();

    public int saveBook(BookReqDto bookReqDto);

    public int updateBookByBookCode(BookReqDto bookReqDto);
    public int maintainUpdateBookByBookCode(BookReqDto bookReqDto);

    public int deleteBookByBookCode(String bookCode);

    public int registerBookImages(List<BookImageDto> bookImageDtos);

    public List<BookImageDto> findBookImageAll(String bookCode);

    public BookImageDto findBookImageByImageId(int imageId);

    public int deleteBookImage(int imageId);



}
