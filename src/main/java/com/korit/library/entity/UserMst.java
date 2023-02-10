package com.korit.library.entity;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserMst {

    @ApiModelProperty(hidden = true) //swagger 에서 post요청에서 예시에서 숨길거 숨기기
    private int userId;

    @NotBlank //->정규식 정리 필요
    @ApiModelProperty(name="username", value = "사용자 이름", example = "abc", required = true)
    private String username;

    @NotBlank
    @ApiModelProperty(name="password", value = "비밀번호", example = "1234", required = true)
    private String password;

    @NotBlank
    @ApiModelProperty(name="repassword", value = "비밀번호 확인", example = "1234", required = true)
    private String repassword;

    @NotBlank
    @ApiModelProperty(name="name", value = "성명", example = "김경민", required = true)
    private String name;

    @NotBlank
    @Email
    @ApiModelProperty(name="email", value = "이메일", example = "abc@naver.com", required = true)
    private String email;

    @ApiModelProperty(name="provider", value = "OAuth 데이터 출처", example = "google", required = false)
    private String provider;

    @ApiModelProperty(hidden = true)//swagger 에서 post요청에서 예시에서 숨길거 숨기기
    private List<RoleDtl> roleDtl;

    @ApiModelProperty(hidden = true)//swagger 에서 post요청에서 예시에서 숨길거 숨기기
    private LocalDateTime createDate;
    @ApiModelProperty(hidden = true)//swagger 에서 post요청에서 예시에서 숨길거 숨기기
    private LocalDateTime updateDate;
}
