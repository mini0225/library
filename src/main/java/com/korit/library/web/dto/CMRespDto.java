package com.korit.library.web.dto;


import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CMRespDto<T>{

    @ApiModelProperty(value = "HTTP STATUS CODE", example = "200")
    private int code; //frontender 들이 해달라고 하면 해주면됨
    @ApiModelProperty(value = "응답 메세지", example = "Successfully")
    private String message;
    private T data;
}