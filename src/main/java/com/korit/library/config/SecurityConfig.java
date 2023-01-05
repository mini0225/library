package com.korit.library.config;






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
public class SecurityConfig extends WebSecurityConfigurerAdapter {

//    @Bean  //Bean annotation 으로 IOC 강제 등록
//    public BCryptPasswordEncoder passwordEncoder(){
//        return new BCryptPasswordEncoder();
//    }
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
                .anyRequest()
                .permitAll()//위의 두개말고는 나머지는 인증(로그인)필요없다~
                .and()
                .formLogin()
                .loginPage("/account/login") //로그인 페이지 get요청
                .loginProcessingUrl("/account/login") //로그인 인증 post요청 => login.html 에서 <form action="/account/login" method="post">
                .defaultSuccessUrl("/index");
    }
}
