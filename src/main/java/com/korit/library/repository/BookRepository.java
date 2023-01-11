package com.korit.library.repository;


import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookRepository {
    /*
        REPOSITORY 구성
        C(create) : 도서등록
        R(read) : 도서 전체 조회,
                  도서 검색
                      1. 도서코드
                      2. 도서명
                      3. 저자
                      4. 출판사
                          1. 전체 조회
                          2. 20개씩 가져 오기
        U(update) : 도서수정
        D(delete) : 도서삭제

    */


}
