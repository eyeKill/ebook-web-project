package com.eyek.ebook.service;

import com.eyek.ebook.facade.LoggerFacade;
import com.eyek.ebook.model.User;
import com.eyek.ebook.repository.RoleRepository;
import com.eyek.ebook.util.SecurityUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;

@Service
@Primary
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userService.findByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException("User " + username + " not found.");

        LoggerFacade.getLogger().info("Loading user, username: " + user.getUsername());
        return new SecurityUser(user);
    }

    public boolean registerNewUserAccount(User newUser) {
        if(userService.findByUsername(newUser.getUsername()) != null)
            return false;
        if(newUser.getRoles().isEmpty())
            newUser.setRoles(Set.of(roleRepository.findByName("ROLE_ADMIN")));

        return true;
    }
}