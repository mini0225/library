package com.korit.library.config;






import com.korit.library.security.PrincipalOAuth2DetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity  //기존의 security 설정값 말고 아래의 WebSecurityConfigurerAdapter 에서 오버라이딩한 SecurityConfig 값을 쓰겠다.
@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final PrincipalOAuth2DetailsService principalOAuth2DetailsService;

    @Bean  //Bean annotation 으로 IOC 강제 등록
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
// -> application.yml 에서 ID/password 등록했지만 여기서 계속 막아서 안됨. 로그인한 이후에는 localhost:8000/account/mypage/dasdsa 해도 로그인 페이지로 전환되지 않음.

    //controll + O 오버라이딩 단축키

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    //PathRequest.toStaticResources().atCommonLocations() - static 경로상 보안을 걸지않는다??

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.httpBasic().disable(); //기본 로그인 화면 안쓰고 우리꺼 쓰겠다.
        http.authorizeRequests()
                .antMatchers("/mypage/**","/security/**")
                .authenticated() // 위에 두개는 인증(로그인)이 필요하다.
//                .
//                .HasRole("ADMIN")
                .anyRequest()
                .permitAll()//위의 두개말고는 나머지는 인증(로그인)필요없다~

                .and()
                .formLogin()
                .loginPage("/account/login") //로그인 페이지 get요청
                .loginProcessingUrl("/account/login") //로그인 인증 post요청 => login.html 에서 <form action="/account/login" method="post">
//                .successForwardUrl("/mypage") 로그인 성공시 ""로 보낸다
                .failureForwardUrl("/account/login/error") //로그인 실패 했을 경우 갈 곳 , forward 앞의 요청을 그대로 이어서 가기 때문에...로그인경우 post요청이니까 ....다시 로그인 화면으로 가야하니까 post...
//                .defaultSuccessUrl("/index") //mypage같은 권한이 필요하여 security에 의해서 강제로 로그인 페이지로 넘어온 경우 -> 원래 요청했던 곳으로 돌아간다.
                                                // 직접 로그인 페이지로 접속했을 경우 접속경로 -> 즉 갈곳이 없을때
                .and()
                .oauth2Login()//sns를 통한 로그인
                .userInfoEndpoint()
                .userService(principalOAuth2DetailsService)
                .and()
                .defaultSuccessUrl("/index"); // 로그인방법 두개
    }
}

// successForwardUrl vs defaultSuccessUrl
// successForwardUrl vs successHandler
