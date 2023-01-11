package com.korit.library.web.api;

import com.korit.library.aop.annotation.ValidAspect;
import com.korit.library.security.PrincipalDetails;
import com.korit.library.service.AccountService;
import com.korit.library.web.dto.CMRespDto;

import com.korit.library.web.dto.UserDto;
import io.swagger.annotations.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.web.servlet.oauth2.resourceserver.OAuth2ResourceServerSecurityMarker;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;


@Slf4j
@Api(tags = {"Account Rest API Controller"})
@RestController
@RequestMapping("/api/account")
public class AccountApi {

    @Autowired
    private AccountService accountService;


    @ApiOperation(value = "회원가입", notes = "회원가입 요청 메소드")  //@Api, @ApiOperation 으로 swagger 변경가능...카톡참조
    @ValidAspect
    @PostMapping("/register")
    public ResponseEntity<? extends CMRespDto<? extends UserDto>> register(@RequestBody @Valid UserDto userDto, BindingResult bindingResult){

        accountService.duplicateUsername(userDto.getUsername());
        accountService.compareToPassword(userDto.getPassword(), userDto.getRepassword());

        UserDto user = accountService.registerUser(userDto);

        return ResponseEntity
                .created(URI.create("/api/account/user/" + user.getUserId()))
                .body(new CMRespDto<>(HttpStatus.CREATED.value(),"Create a new User", user));
    }

    @ApiImplicitParams({ //column이 여러개 인경우
            @ApiImplicitParam(name = "userId", value ="사용자 식별 코드", required = true/*필수란 뜻*/, dataType = "int")
//          ,@ApiImplicitParam 으로 또 만들면됨.
    })
    @ApiResponses({
            @ApiResponse(code = 400, message = "클라이언트가 잘못 했음."),
            @ApiResponse(code = 401, message = "클라이언트가 잘못 했음2.")

    })

    @GetMapping("/user/{userId}")
    public ResponseEntity<?  extends CMRespDto<? extends UserDto>> getUser(
//            @ApiParam(value="사용자 식별 코드") : column이 별로 없을경우 가능, 해당변수만 적용시킬경우
            @PathVariable int userId){
        return ResponseEntity.ok().body(new CMRespDto<>(HttpStatus.OK.value(),"Success", accountService.getUser(userId)));
    }

    @ApiOperation(value="Get Principal", notes = "로그인된 사용자 정보 가져오기")
    @GetMapping("/principal")
    public ResponseEntity<CMRespDto<? extends PrincipalDetails>>getPrincipalDetails(@ApiParam(name ="principalDetails", hidden = true) @AuthenticationPrincipal PrincipalDetails principalDetails){
        principalDetails.getAuthorities().forEach(role -> {
            log.info("로그인된 사용자의 권한 : {}", role.getAuthority());
        });

        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(HttpStatus.OK.value(), "Success", principalDetails));
    }

}
