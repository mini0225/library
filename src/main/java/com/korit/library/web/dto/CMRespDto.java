package com.korit.library.web.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CMRespDto<T>{
    private int code; //frontender 들이 해달라고 하면 해주면됨

    private String message;
    private T data;
}