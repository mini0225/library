package com.korit.library.service;


import com.korit.library.exception.CustomValidationException;
import com.korit.library.repository.BookRepository;
import com.korit.library.web.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class BookService {

    @Value("${file.path}") //application.yml 안의 (표현식)경로를 들고온다.
    private String filePath;


    @Autowired
    private BookRepository bookRepository;


    public List<BookMstDto> searchBook(SearchReqDto searchReqDto){
        searchReqDto.setIndex();
        return bookRepository.searchBook(searchReqDto);
    }

    public List<CategoryDto> getCategories(){
        return bookRepository.findAllCategory();

    }

    public void registerBook(BookReqDto bookReqDto){
        duplicateBookCode(bookReqDto.getBookCode());
        bookRepository.saveBook(bookReqDto);
    }


    private void duplicateBookCode(String bookCode) {
        BookMstDto bookMstDto = bookRepository.findBookByBookCode(bookCode);
        if (bookMstDto != null) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("bookCode", "이미 존재하는 도서코드입니다..");

            throw new CustomValidationException(errorMap);
        }
    }

    public void modifyBook(BookReqDto bookReqDto){
        bookRepository.updateBookByBookCode(bookReqDto);
    }
    public void maintainModifyBook(BookReqDto bookReqDto){
        bookRepository.maintainUpdateBookByBookCode(bookReqDto);
    }
    public void deleteBook(String bookCode){
        bookRepository.deleteBookByBookCode(bookCode);
    }

    public void registerBookImages(String bookCode, List<MultipartFile> files){
        if(files.size() < 1) {
            Map<String, String> errorMap = new HashMap<String, String>();
            errorMap.put("files", "이미지를 선택하세요.");

            throw new CustomValidationException(errorMap);
        }

        List<BookImageDto> bookImageDtos = new ArrayList<BookImageDto>();
        files.forEach(file -> {
            String originFileName = file.getOriginalFilename();
            String extension = originFileName.substring(originFileName.lastIndexOf(".")); //substring : 뒤에서 부터 '.'까지 잘라라 ex) .png
            String tempFileName = UUID.randomUUID().toString().replaceAll("-","") + extension; //UUID 임시로 id잡아준다 => 가짜이름 + extension(.png)

            Path uploadPath = Paths.get(filePath + "/book/" + tempFileName);
            //filePath + "/book/" + tempFileName 이 경로로 uploadPath에 지정?저장?
            //path, paths : java.nio.file 로 import

            File f = new File(filePath + "/book");

            if(!f.exists()){ // ->경로유무 확인.
                f.mkdirs();
            }// => 경로가 없으면 경로 생성해라

            try {  //try패치....?
                Files.write(uploadPath, file.getBytes()); //위에서 들고온거 써라...
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            BookImageDto bookImageDto = BookImageDto.builder()
                    .bookCode(bookCode)
                    .saveName(tempFileName)
                    .originName(originFileName)
                    .build();
            bookImageDtos.add(bookImageDto);

        });

        bookRepository.registerBookImages(bookImageDtos);

    }
}
