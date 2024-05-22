package com.stackoverflow.demo.securingweb;

import com.stackoverflow.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userService.getByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException("Bye");
        return UserPrincipal.builder()
                .userId(user.getUserId())
                .username(user.getUserName())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(user.getRole().getRoleName())))
                .build();
    }
}
