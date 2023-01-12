package com.korit.library.web.dto;


import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SearchReqDto {

    @ApiModelProperty(required = false, example = "나는")
    private String searchValue;

    @ApiModelProperty(required = false, example = "소설")
    private String category;

    @ApiModelProperty(required = false, example = "bookName")
    private String order;

    @NotBlank
    @ApiModelProperty(value = "전체조회 = N, 조회제한 = Y", required = true)
    private String limit; //no or yes 항상 있어야 해서 notblank

    @ApiModelProperty(required = false, example = "1")
    private int page;

    @ApiModelProperty(required = false, example = "20")
    private int count;

    @ApiModelProperty(hidden=true)
    private int index;

    public void setIndex(){
        index = (page-1)* count;

    }

}
