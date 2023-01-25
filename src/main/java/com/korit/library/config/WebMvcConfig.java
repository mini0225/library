package com.korit.library.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

/*
    요청주소에서 image 를 띄울때
 */


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.path}")
    private String filePath;

    //http://127.0.0.1:5500 서버에서 들어오는 모든 요청("/**")에 대해서 CORS 오류 해결
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("http://127.0.0.1:5500/");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        WebMvcConfigurer.super.addResourceHandlers(registry);
        registry.addResourceHandler("/image/**")// /image/** 이 요청주소로 들어오면 file:///" + filePath 주소를 참고해라
                .addResourceLocations("file:///" + filePath) //filePath : image가 저장된 실제 경로 ( application.yml )
                .resourceChain(true)
                .addResolver(new PathResourceResolver(){

                    //한글 깨짐 방지 디코딩
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        resourcePath = URLDecoder.decode(resourcePath, StandardCharsets.UTF_8);
                        return super.getResource(resourcePath, location);
                    }
                });
    }
}
