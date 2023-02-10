package com.korit.library.security;

import com.korit.library.entity.UserMst;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;


@RequiredArgsConstructor
@AllArgsConstructor
public class PrincipalDetails implements UserDetails, OAuth2User {


    @Getter
    private final UserMst user;
    private Map<String, Object> response;
//    AllargsConstructor 있으니까 없어도됨.
//    public PrincipalDetails(UserMst user, Map<String, Object> response){
//        this.user = user;
//        this.response = response;
//    }


    //권한을 list로 관리하는 부분.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {  //GrantedAuthority
        ArrayList<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

//        List<RoleDtlDto> roleDtlDtoList = user.getRoleDtlDto();
//        for(int i = 0; i< roleDtlDtoList.size(); i++){
//            RoleDtlDto roleDtlDto = roleDtlDtoList.get(i); // 0 = ROLE_USER , 1 = ROLE_ADMIN
//            RoleMstDto roleMstDto = roleDtlDto.getRoleMstDto();
//            String roleName = roleMstDto.getRoleName();
//
//            GrantedAuthority role = new GrantedAuthority() {
//                @Override
//                public String getAuthority() {
//                    return roleName;
//                }
//            };
//            authorities.add(role);
//
////            System.out.println(roleName == role.getAuthority());
//        }

        user.getRoleDtl().forEach(dtl -> {
            authorities.add(() -> dtl.getRoleMst().getRoleName());
        });
        return authorities; //모든 권한이 다 들어옴.
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    //true 가 하나라도 있으면 실행 x
    /*
      계정 만료 여부
    */
    @Override
    public boolean isAccountNonExpired() {
        return true; //만료가 아직이다
    }

    /*
      계정 잠김 여부
    */
    @Override
    public boolean isAccountNonLocked() {
        return true; //휴먼계정, 블랙리스트 넣을때 , false=잠김
    }

    /*
      비밀번호 만료 여부
    */
    @Override
    public boolean isCredentialsNonExpired() {
        return true; //비밀번호 5회 이상 틀릴때
    }

    /*
       사용자 활성화 여부
    */
    @Override
    public boolean isEnabled() {
        return true; //회원가입 후 전화 또는 이메일 인증으로 본인 인증(?) 할때
                    //휴먼계정 전환시에
    }
    @Override
    public String getName() {
        return user.getName();
    }

    @Override
    public Map<String, Object> getAttributes() { //user 정보가 다 담겨잇음.

        return response;
    }


}
