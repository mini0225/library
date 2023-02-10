package com.korit.library.security;

import com.korit.library.entity.UserMst;
import com.korit.library.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

/*

DefaultOAuth2UserService 클래스 내에서 loadUser가 동작을 하면서 DefaultOAuth2User implements함.
userRequest 구글에서 다 받아와서 우리가 oAuth2User변수로 잡는다
 */

@Service
@RequiredArgsConstructor
public class PrincipalOAuth2DetailsService extends DefaultOAuth2UserService {

    private final AccountRepository accountRepository; // (23.02.10)이미 가입된 username 중복찾기용


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        PrincipalDetails principalDetails = null;

        System.out.println("userRequest >>>> " + userRequest);
        System.out.println("ClientRegistration >>>> " + userRequest.getClientRegistration());
        System.out.println("Attributes >>>> " + oAuth2User.getAttributes());

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email"); //Object 니까 다운캐스팅필요
        String username = email.substring(0, email.indexOf("@")); //@전까지 아이디
//        String name = (String) attributes.get("name"); //Object 니까 다운캐스팅필요
//
//        String password = new BCryptPasswordEncoder().encode(UUID.randomUUID().toString()); // 임시 비밀번호 생성 , 구글꺼 땡겨오니까 비밀번호 노필요
        //user.mst에서 provider 칼럼 하나 더 생성 null이면 자체가입 null 아니면 구글or 네이버
        String provider = userRequest.getClientRegistration().getClientName(); //getClientName 여기서는 구글

        UserMst userMst = accountRepository.findUserByUsername(username);

        if(userMst ==null){ //null 아니면 가입안되어있음.
            String name = (String) attributes.get("name");
            String password = new BCryptPasswordEncoder().encode(UUID.randomUUID().toString());

            //임의생성 (role 값이 없음)
            userMst = UserMst.builder()
                    .username(username)
                    .password(password)
                    .name(name)
                    .email(email)
                    .provider(provider)
                    .build();

            accountRepository.saveUser(userMst);
//            int userId = userMst.getUserId(); userMst 안에 들어잇으니까 없어도됨.
            accountRepository.saveRole(userMst);
            userMst = accountRepository.findUserByUsername(username); //회원가입끝났으면 username 정보 다시 들고와라

            //여기까지 회원가입.......


        }else if(userMst.getProvider() == null ){ //provider 가 비었다. 즉 일반회원가입임. => sns랑 연동시켜주겟다???
            userMst.setProvider(provider);
            accountRepository.setUserProvider(userMst);

        }
        principalDetails = new PrincipalDetails(userMst, attributes);


//        return super.loadUser(userRequest);
        return principalDetails;
    }
}

