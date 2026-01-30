//package com.bharatteeka.auth.service;
//
//import com.bharatteeka.auth.entity.Patient;
//import java.time.format.DateTimeParseException;
//
//import com.bharatteeka.auth.entity.User;
//import com.bharatteeka.auth.repository.PatientRepository;
//import com.bharatteeka.auth.repository.UserRepository;
//import com.bharatteeka.auth.security.JwtUtil;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class AuthService {
//
//	@Autowired
//	private UserRepository userRepository;
//
//	@Autowired
//	private PatientRepository patientRepository;
//	
//	@Autowired
//	private JwtUtil jwtUtil;
//
//
//	@Transactional
//	public User registerPatient(String username, String password, String email, String phone, String address,
//			String firstName, String lastName, LocalDate dateOfBirth, String gender, String aadhaarNumber,
//			String bloodGroup, String remarks) {
//
//		if (isBlank(username) || username.trim().length() < 3) {
//			throw new RuntimeException("Username must be at least 3 characters");
//		}
//		if (isBlank(password) || password.length() < 6) {
//			throw new RuntimeException("Password must be at least 6 characters");
//		}
//		if (isBlank(email)) {
//			throw new RuntimeException("Email is required");
//		}
//		if (isBlank(phone)) {
//			throw new RuntimeException("Phone is required");
//		}
//		if (isBlank(address)) {
//			throw new RuntimeException("Address is required");
//		}
//		if (isBlank(firstName)) {
//			throw new RuntimeException("First name is required");
//		}
//		if (isBlank(lastName)) {
//			throw new RuntimeException("Last name is required");
//		}
//		if (dateOfBirth == null) {
//			throw new RuntimeException("Date of birth is required");
//		}
//		if (isBlank(gender)) {
//			throw new RuntimeException("Gender is required");
//		}
//
//		if (isBlank(aadhaarNumber) || !aadhaarNumber.matches("^\\d{12}$")) {
//			throw new RuntimeException("Aadhaar must be exactly 12 digits");
//		}
//		if (isBlank(bloodGroup)) {
//			throw new RuntimeException("Blood group is required");
//		}
//
//		if (userRepository.existsByUsername(username.trim())) {
//			throw new RuntimeException("Username already exists");
//		}
//		if (userRepository.existsByEmail(email.trim())) {
//			throw new RuntimeException("Email already exists");
//		}
//		if (userRepository.existsByPhone(phone.trim())) {
//			throw new RuntimeException("Phone number already exists");
//		}
//
//		User user = new User();
//
//		user.setRoleId(4);
//
//		user.setUsername(username.trim());
//		user.setPassword(password);
//		user.setEmail(email.trim());
//		user.setPhone(phone.trim());
//		user.setAddress(address.trim());
//		user.setIsActive(true);
//
//		User savedUser = userRepository.save(user);
//
//		Patient patient = new Patient();
//		patient.setUser(savedUser);
//		patient.setFirstName(firstName.trim());
//		patient.setLastName(lastName.trim());
//		patient.setDateOfBirth(dateOfBirth);
//		patient.setGender(gender);
//		patient.setAadhaarNumber(aadhaarNumber.trim());
//		patient.setBloodGroup(bloodGroup);
//		patient.setIsAdult(true);
//		patient.setIsActive(true);
//		patient.setRemarks(isBlank(remarks) ? null : remarks.trim());
//
//		patientRepository.save(patient);
//
//		return savedUser;
//	}
//	
//	public Map<String, Object> loginWithToken(String username, String password, Integer hospitalId) {
//
//	    if (isBlank(username) || isBlank(password)) {
//	        throw new RuntimeException("Username and password are required");
//	    }
//
//	    User user = userRepository.findByUsername(username.trim())
//	            .orElseThrow(() -> new RuntimeException("User not found"));
//
//	    if (Boolean.FALSE.equals(user.getIsActive())) {
//	        throw new RuntimeException("Account is inactive");
//	    }
//
//	    if (!user.getPassword().equals(password)) {
//	        throw new RuntimeException("Incorrect password");
//	    }
//
//	    // Convert roleId → roleName
//	    String roleName = switch (user.getRoleId()) {
//	    case 1 -> "ADMIN";
//	    case 2 -> "HOSPITAL";
//	    case 3 -> "PATIENT";
//	    case 4 -> "PARENT";
//	    default -> "UNKNOWN";
//	};
//
//
//	    //  JWT Claims
//	    Map<String, Object> claims = new HashMap<>();
//	    claims.put("roleId", user.getRoleId());
//	    claims.put("role", roleName);
//	    if (hospitalId != null) claims.put("hospitalId", hospitalId);
//
//	    String token = jwtUtil.generateToken(user.getUsername(), claims);
//
//	    Map<String, Object> result = new HashMap<>();
//	    result.put("user", user);
//	    result.put("token", token);
//
//	    return result;
//	}
//
//
//	private boolean isBlank(String s) {
//		return s == null || s.trim().isEmpty();
//	}
//	
//	public boolean verifyForgotPassword(String username, String email, String aadhaar, String dobStr) {
//
//	    if (isBlank(username) || isBlank(email) || isBlank(aadhaar) || isBlank(dobStr)) {
//	        return false;
//	    }
//
//	    LocalDate dob;
//	    try {
//	        dob = LocalDate.parse(dobStr.trim()); // expects yyyy-MM-dd
//	    } catch (DateTimeParseException ex) {
//	        return false;
//	    }
//
//	    User user = userRepository.findByUsername(username.trim()).orElse(null);
//	    if (user == null) return false;
//
//	    // email check (case-insensitive)
//	    if (user.getEmail() == null || !user.getEmail().trim().equalsIgnoreCase(email.trim())) {
//	        return false;
//	    }
//
//	    Patient patient = patientRepository.findByUser_UserId(user.getUserId()).orElse(null);
//	    if (patient == null) return false;
//
//	    if (patient.getAadhaarNumber() == null || !patient.getAadhaarNumber().trim().equals(aadhaar.trim())) {
//	        return false;
//	    }
//
//	    if (patient.getDateOfBirth() == null || !patient.getDateOfBirth().equals(dob)) {
//	        return false;
//	    }
//
//	    return true;
//	}
//
//	@Transactional
//	public void resetPassword(String username, String email, String aadhaar, String dobStr,
//	                          String newPassword, String confirmPassword) {
//
//	    if (isBlank(newPassword) || newPassword.length() < 6) {
//	        throw new RuntimeException("Password must be at least 6 characters");
//	    }
//	    if (!newPassword.equals(confirmPassword)) {
//	        throw new RuntimeException("Passwords do not match");
//	    }
//
//	    boolean ok = verifyForgotPassword(username, email, aadhaar, dobStr);
//	    if (!ok) {
//	        throw new RuntimeException("Details do not match. Cannot reset password.");
//	    }
//
//	    User user = userRepository.findByUsername(username.trim())
//	            .orElseThrow(() -> new RuntimeException("User not found"));
//
//	    // IMPORTANT: keep consistent with your current login (plain-text compare)
//	    user.setPassword(newPassword);
//
//	    userRepository.save(user);
//	}
//
//	
//}

package com.bharatteeka.auth.service;

import com.bharatteeka.auth.entity.Patient;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.PatientRepository;
import com.bharatteeka.auth.repository.UserRepository;
import com.bharatteeka.auth.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // BCrypt hashes usually start with $2a$ / $2b$ / $2y$
    private boolean isBcryptHash(String s) {
        if (s == null) return false;
        return s.startsWith("$2a$") || s.startsWith("$2b$") || s.startsWith("$2y$");
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private void validateEmail(String email) {
        if (isBlank(email)) throw new RuntimeException("Email is required");
        String e = email.trim();
        // simple email format check (Bean validation already exists on entity, but we validate inputs early)
        if (!e.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("Invalid email format");
        }
    }

    private void validatePhone(String phone) {
        if (isBlank(phone)) throw new RuntimeException("Phone is required");
        String p = phone.trim();
        if (!p.matches("^[6-9]\\d{9}$")) {
            throw new RuntimeException("Phone must be a valid 10-digit Indian number");
        }
    }

    private void validateAadhaar(String aadhaarNumber) {
        if (isBlank(aadhaarNumber) || !aadhaarNumber.trim().matches("^\\d{12}$")) {
            throw new RuntimeException("Aadhaar must be exactly 12 digits");
        }
    }

    private void validateUsername(String username) {
        if (isBlank(username)) throw new RuntimeException("Username is required");
        String u = username.trim();
        if (u.length() < 3) throw new RuntimeException("Username must be at least 3 characters");
        if (u.length() > 50) throw new RuntimeException("Username must be at most 50 characters");
        // optional: only allow letters, numbers, underscore, dot
        if (!u.matches("^[A-Za-z0-9._]+$")) {
            throw new RuntimeException("Username can contain only letters, numbers, dot and underscore");
        }
    }

    private void validateStrongPassword(String password) {
        if (isBlank(password)) {
            throw new RuntimeException("Password is required");
        }
        if (password.contains(" ")) {
            throw new RuntimeException("Password must not contain spaces");
        }

        // Strong password:
        // min 8 chars, 1 lowercase, 1 uppercase, 1 digit, 1 special
        String pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&^#])[A-Za-z\\d@$!%*?&^#]{8,}$";
        if (!password.matches(pattern)) {
            throw new RuntimeException(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
            );
        }
    }

    private void validateName(String label, String value) {
        if (isBlank(value)) throw new RuntimeException(label + " is required");
        String v = value.trim();
        if (v.length() > 50) throw new RuntimeException(label + " max 50 characters");
        // optional: allow letters + spaces
        if (!v.matches("^[A-Za-z ]+$")) {
            throw new RuntimeException(label + " must contain only letters");
        }
    }

    private void validateGender(String gender) {
        if (isBlank(gender)) throw new RuntimeException("Gender is required");
        // optional normalization check
        String g = gender.trim();
        if (g.length() > 20) throw new RuntimeException("Gender is invalid");
    }

    private void validateDob(LocalDate dob) {
        if (dob == null) throw new RuntimeException("Date of birth is required");
        if (dob.isAfter(LocalDate.now())) throw new RuntimeException("Date of birth cannot be in the future");
        if (dob.isAfter(LocalDate.now().minusYears(18))) throw new RuntimeException("Only 18+ can register");
    }

    private void validateAddress(String address) {
        if (isBlank(address)) throw new RuntimeException("Address is required");
        if (address.trim().length() < 5) throw new RuntimeException("Address is too short");
    }

    private void validateBloodGroup(String bloodGroup) {
        if (isBlank(bloodGroup)) throw new RuntimeException("Blood group is required");
        String bg = bloodGroup.trim().toUpperCase();
        // allow common blood groups
        if (!bg.matches("^(A|B|AB|O)[+-]$")) {
            throw new RuntimeException("Invalid blood group (example: A+, O-, AB+)");
        }
    }

    @Transactional
    public User registerPatient(
            String username,
            String password,
            String email,
            String phone,
            String address,
            String firstName,
            String lastName,
            LocalDate dateOfBirth,
            String gender,
            String aadhaarNumber,
            String bloodGroup,
            String remarks
    ) {

        // ✅ Input validations
        validateUsername(username);
        validateStrongPassword(password);
        validateEmail(email);
        validatePhone(phone);
        validateAddress(address);
        validateName("First name", firstName);
        validateName("Last name", lastName);
        validateDob(dateOfBirth);
        validateGender(gender);
        validateAadhaar(aadhaarNumber);
        validateBloodGroup(bloodGroup);

        // ✅ Uniqueness checks
        if (userRepository.existsByUsername(username.trim())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email.trim())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByPhone(phone.trim())) {
            throw new RuntimeException("Phone number already exists");
        }

        User user = new User();
        user.setRoleId(4);
        user.setUsername(username.trim());

        // ✅ SAVE ENCRYPTED PASSWORD
        user.setPassword(passwordEncoder.encode(password));

        user.setEmail(email.trim());
        user.setPhone(phone.trim());
        user.setAddress(address.trim());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(savedUser);
        patient.setFirstName(firstName.trim());
        patient.setLastName(lastName.trim());
        patient.setDateOfBirth(dateOfBirth);
        patient.setGender(gender.trim());
        patient.setAadhaarNumber(aadhaarNumber.trim());
        patient.setBloodGroup(bloodGroup.trim().toUpperCase());
        patient.setIsAdult(true);
        patient.setIsActive(true);
        patient.setRemarks(isBlank(remarks) ? null : remarks.trim());

        patientRepository.save(patient);

        return savedUser;
    }

    public Map<String, Object> loginWithToken(String username, String password, Integer hospitalId) {

        if (isBlank(username) || isBlank(password)) {
            throw new RuntimeException("Username and password are required");
        }

        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("Account is inactive");
        }

        String dbPass = user.getPassword();
        boolean ok;

        // ✅ Backward compatible password check + auto upgrade
        if (isBcryptHash(dbPass)) {
            ok = passwordEncoder.matches(password, dbPass);
        } else {
            ok = dbPass != null && dbPass.equals(password);
            if (ok) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
            }
        }

        if (!ok) {
            throw new RuntimeException("Incorrect password");
        }

        String roleName = switch (user.getRoleId()) {
            case 1 -> "ADMIN";
            case 2 -> "HOSPITAL";
            case 3 -> "PATIENT";
            case 4 -> "PARENT";
            default -> "UNKNOWN";
        };

        Map<String, Object> claims = new HashMap<>();
        claims.put("roleId", user.getRoleId());
        claims.put("role", roleName);
        if (hospitalId != null) claims.put("hospitalId", hospitalId);

        String token = jwtUtil.generateToken(user.getUsername(), claims);

        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("token", token);

        return result;
    }

    public boolean verifyForgotPassword(String username, String email, String aadhaar, String dobStr) {

        if (isBlank(username) || isBlank(email) || isBlank(aadhaar) || isBlank(dobStr)) {
            return false;
        }

        LocalDate dob;
        try {
            dob = LocalDate.parse(dobStr.trim()); // expects yyyy-MM-dd
        } catch (DateTimeParseException ex) {
            return false;
        }

        User user = userRepository.findByUsername(username.trim()).orElse(null);
        if (user == null) return false;

        if (user.getEmail() == null || !user.getEmail().trim().equalsIgnoreCase(email.trim())) {
            return false;
        }

        Patient patient = patientRepository.findByUser_UserId(user.getUserId()).orElse(null);
        if (patient == null) return false;

        if (patient.getAadhaarNumber() == null || !patient.getAadhaarNumber().trim().equals(aadhaar.trim())) {
            return false;
        }

        if (patient.getDateOfBirth() == null || !patient.getDateOfBirth().equals(dob)) {
            return false;
        }

        return true;
    }

    @Transactional
    public void resetPassword(
            String username,
            String email,
            String aadhaar,
            String dobStr,
            String newPassword,
            String confirmPassword
    ) {

        validateStrongPassword(newPassword);

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        boolean ok = verifyForgotPassword(username, email, aadhaar, dobStr);
        if (!ok) {
            throw new RuntimeException("Details do not match. Cannot reset password.");
        }

        User user = userRepository.findByUsername(username.trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ SAVE ENCRYPTED PASSWORD
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}



