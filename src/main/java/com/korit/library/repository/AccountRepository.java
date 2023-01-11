package com.korit.library.repository;


import com.korit.library.web.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountRepository {

    public UserDto findUserByUsername(String username);

    public UserDto findUserByUserId(int userId);

    public int saveUser(UserDto user);

    public int saveRole(UserDto user);

}
