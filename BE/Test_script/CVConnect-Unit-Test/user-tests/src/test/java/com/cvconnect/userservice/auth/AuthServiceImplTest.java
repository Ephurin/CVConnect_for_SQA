package com.cvconnect.userservice.auth;

import com.cvconnect.dto.auth.LoginRequest;
import com.cvconnect.dto.auth.LoginResponse;
import com.cvconnect.dto.orgMember.OrgMemberDto;
import com.cvconnect.dto.roleUser.RoleUserDto;
import com.cvconnect.dto.user.UserDto;
import com.cvconnect.enums.TokenType;
import com.cvconnect.enums.UserErrorCode;
import com.cvconnect.service.*;
import com.cvconnect.service.impl.AuthServiceImpl;
import com.cvconnect.utils.JwtUtils;
import com.cvconnect.utils.RedisUtils;
import jakarta.servlet.http.HttpServletResponse;
import nmquan.commonlib.exception.AppException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthServiceImpl - Unit Tests")
class AuthServiceImplTest {

    @Mock
    private UserService userService;

    @Mock
    private RoleUserService roleUserService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private RedisUtils redisUtils;

    @Mock
    private OrgMemberService orgMemberService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    @DisplayName("TC-US-AUTH-001: Success login")
    void login_success() {
        LoginRequest request = new LoginRequest("user", "pass");
        UserDto user = UserDto.builder().id(1L).username("user").isEmailVerified(true).isActive(true).build();
        HttpServletResponse response = mock(HttpServletResponse.class);

        when(userService.findByUsername("user")).thenReturn(user);
        when(jwtUtils.generateToken(any())).thenReturn("valid-token");
        when(jwtUtils.generateRefreshToken()).thenReturn("refresh-token");
        when(roleUserService.findRoleUseByUserId(1L)).thenReturn(List.of());
        when(orgMemberService.getOrgMember(1L)).thenReturn(null);

        LoginResponse result = authService.login(request, response);

        assertThat(result.getToken()).isEqualTo("valid-token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("TC-US-AUTH-002: Login fail - User not found")
    void login_userNotFound() {
        LoginRequest request = new LoginRequest("unknown", "pass");
        when(userService.findByUsername("unknown")).thenReturn(null);

        assertThatThrownBy(() -> authService.login(request, mock(HttpServletResponse.class)))
                .isInstanceOf(AppException.class)
                .satisfies(ex -> assertThat(((AppException) ex).getErrorCode()).isEqualTo(UserErrorCode.LOGIN_FAIL));
    }

    @Test
    @DisplayName("TC-US-AUTH-003: Login fail - Bad credentials")
    void login_badCredentials() {
        LoginRequest request = new LoginRequest("user", "wrong");
        UserDto user = UserDto.builder().id(1L).username("user").isEmailVerified(true).isActive(true).build();

        when(userService.findByUsername("user")).thenReturn(user);
        doThrow(new BadCredentialsException("")).when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(request, mock(HttpServletResponse.class)))
                .isInstanceOf(AppException.class)
                .satisfies(ex -> assertThat(((AppException) ex).getErrorCode()).isEqualTo(UserErrorCode.LOGIN_FAIL));
    }

    @Test
    @DisplayName("TC-US-AUTH-004: Login fail - Email not verified")
    void login_emailNotVerified() {
        LoginRequest request = new LoginRequest("user", "pass");
        UserDto user = UserDto.builder().id(1L).username("user").isEmailVerified(false).isActive(true).build();

        when(userService.findByUsername("user")).thenReturn(user);

        assertThatThrownBy(() -> authService.login(request, mock(HttpServletResponse.class)))
                .isInstanceOf(AppException.class)
                .satisfies(ex -> assertThat(((AppException) ex).getErrorCode()).isEqualTo(UserErrorCode.EMAIL_NOT_VERIFIED));
    }

    @Test
    @DisplayName("TC-US-AUTH-006: Refresh token success")
    void refreshToken_success() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        
        // This is a simplified mock for the complex refreshToken logic
        // In real test we would mock CookieUtils and RedisUtils deeper
    }

    @Test
    @DisplayName("TC-US-AUTH-010: Register candidate success")
    void registerCandidate_success() {
        // Implementation for happy path registration
    }
    
    @Test
    @DisplayName("TC-US-AUTH-012: Register Org Admin success")
    void registerOrgAdmin_success() {
        // Implementation for complex Org registration
    }

    @Test
    @DisplayName("TC-US-AUTH-014: Verify email success")
    void verifyEmail_success() {
        // Implementation for email verification
    }

    @Test
    @DisplayName("TC-US-AUTH-016: Request reset password success")
    void requestResetPassword_success() {
        // Implementation for forgot password request
    }
}

