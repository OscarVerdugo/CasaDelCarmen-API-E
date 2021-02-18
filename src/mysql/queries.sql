DELIMITER //
CREATE PROCEDURE SP_Check_Email_Already_Exists(IN email VARCHAR(254))
BEGIN
	SELECT U.email FROM users AS U WHERE U.email = email;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE SP_Check_Employee_Has_User(IN employee_id INT)
BEGIN
	SELECT U.employee_id FROM users AS U WHERE U.employee_id = employee_id;
END//
DELIMITER ;

DROP PROCEDURE SP_Create_User;
DELIMITER //
CREATE PROCEDURE SP_Create_User (IN emaiL VARCHAR(254), IN `password` TEXT,IN employee_id INT)
BEGIN
	INSERT INTO users (email,employee_id,`password`,created_at)
	SELECT
		email,
		employee_id,
		`password`,
		NOW();
	SELECT LAST_INSERT_ID();
END//
DELIMITER ;

DELETE PROCEDURE SP_Login_User;
DELIMITER //
CREATE PROCEDURE SP_Login_User (IN $emaiL VARCHAR(254))
BEGIN
	SELECT id,email,`password`
	FROM users
	WHERE email = $email
	LIMIT 1;
END//
DELIMITER ;


DROP PROCEDURE SP_User_Profiles;
DELIMITER //
CREATE PROCEDURE SP_User_Profiles (IN $user_id INT,IN $platform VARCHAR(20))
BEGIN

SELECT 
	p.id AS profile_id,
	p.`name`,
	(SELECT JSON_ARRAYAGG(JSON_OBJECT('id',m.id,'name',m.`name`,'route',m.route)) 
		FROM profile_module AS pm
		LEFT JOIN modules AS m 
			ON pm.module_id = m.id
		WHERE pm.profile_id = p.id AND
				m.platform = $platform OR
				m.platform = 'both') AS `modules`
FROM user_profiles AS up
LEFT JOIN `profiles` AS p
	ON up.profile_id = p.id
WHERE up.user_id = $user_id
	AND p.active = 1;

END//
DELIMITER ;


DROP PROCEDURE SP_Store_Admission;
DELIMITER //
CREATE PROCEDURE SP_Store_Admission (
	IN $first_name VARCHAR(70),
	IN $paternal_surname VARCHAR(50),
	IN $maternal_surname VARCHAR(50),
	IN $birthday DATE,
	IN $gender VARCHAR(20),
	IN $marital_status VARCHAR(30),
	IN $sons INT,
	IN $brothers INT,
	IN $all_agree TINYINT,
	IN $native_city_id INT,
	IN $mobile_phone VARCHAR(20),
	IN $home_phone VARCHAR(20),
	IN $employment_id INT,
	IN $ssn VARCHAR(12),
	IN $health_institution VARCHAR(100),
	IN $social_program VARCHAR(100),
	IN $scholarship_id INT,
	IN $religion_id INT,
	IN $street VARCHAR(50),
	IN $house_number VARCHAR(10),
	IN $suburb VARCHAR(50),
	IN $city_id INT,
	IN $state_id INT,
	IN $comments TEXT,
	IN $creation_user_id INT,
	IN $area_id INT
)
BEGIN
	DECLARE _patient_id INT;
	DECLARE _appointment_id INT;
	INSERT INTO patients (
	first_name,
	paternal_surname,
	maternal_surname,
	birthday,
	gender,
	marital_status,
	sons,
	brothers,
	all_agree,
	native_city_id,
	mobile_phone,
	home_phone,
	employment_id,
	ssn,
	health_institution,
	social_program,
	scholarship_id,
	religion_id,
	street,
	house_number,
	suburb,
	city_id,
	state_id,
	comments,
	creation_user_id,
	created_at
	)
	SELECT
		$first_name,
		$paternal_surname,
		$maternal_surname,
		$birthday,
		$gender,
		$marital_status,
		$sons,
		$brothers,
		$all_agree,
		$native_city_id,
		$mobile_phone,
		$home_phone,
		$employment_id,
		$ssn,
		$health_institution,
		$social_program,
		$scholarship_id,
		$religion_id,
		$street,
		$house_number,
		$suburb,
		$city_id,
		$state_id,
		$comments,
		$creation_user_id,
		NOW();
	SET _patient_id = LAST_INSERT_ID();
	
	INSERT INTO admission_applications(
		area_id,
		patient_id,
		`status`,
		creation_user_id,
		created_at
	)
	SELECT 
		$area_id,
		_patient_id,
		1,
		$creation_user_id,
		NOW();
		
	INSERT INTO appointments(
		patient_id,
		area_id,
		`status`,
		creation_user_id,
		created_at
	)
	SELECT 
		_patient_id,
		$area_id,
		0,
		$creation_user_id,
		NOW();
	SET _appointment_id = LAST_INSERT_ID();
	
	INSERT INTO medical_appointments(
		appointment_id
	)
	SELECT
		_appointment_id;
		
	SELECT _patient_id;
	
END//
DELIMITER ;


DROP PROCEDURE SP_ShowIndex_Admission_Application;
DELIMITER //
CREATE PROCEDURE SP_ShowIndex_Admission_Application(
	IN $admission_id INT,
	IN $take INT,
	IN `$offset` INT
)
BEGIN
	DECLARE _take BIGINT;
	DECLARE `_offset` BIGINT;
	SET _take = IFNULL($take,2147483647);
	SET _offset = IFNULL(`$offset`,0);
	SELECT
		ap.id,
		ap.area_id,
		a.`name` AS  area_name,
		ap.patient_id,
		CONCAT(p.first_name,' ',p.paternal_surname,' ',p.maternal_surname) AS patient_name,
		ap.creation_user_id,
		cu.email AS creation_user_email,
		ap.update_user_id,
		uu.email AS update_user_email,
		ap.created_at,
		ap.updated_at,
		ap.`status`,
		ap.active
	FROM admission_applications AS ap
	LEFT JOIN areas AS a ON a.id = ap.area_id
	LEFT JOIN patients AS p ON p.id = ap.patient_id
	LEFT JOIN users AS cu ON cu.id = ap.creation_user_id
	LEFT JOIN users AS uu ON uu.id = ap.update_user_id
	WHERE
		ap.id = IFNULL($admission_id,ap.id)
	LIMIT _offset,_take;

END//
DELIMITER ;











DROP PROCEDURE SP_Show_Admission_Application;
DELIMITER //
CREATE PROCEDURE SP_Show_Admission_Application(
	IN $admission_id INT,
	IN $take INT,
	IN `$offset` INT
)
BEGIN

	DECLARE _take BIGINT;
	DECLARE `_offset` BIGINT;
	SET _take = IFNULL($take,2147483647);
	SET `_offset` = IFNULL(`$offset`,0);
	SELECT
		ap.id,
		ap.area_id,
		a.`name` AS  area_name,
		ap.patient_id,
		CONCAT(p.first_name,' ',p.paternal_surname,' ',p.maternal_surname) AS patient_name,
		ap.creation_user_id,
		cu.email AS creation_user_email,
		ap.update_user_id,
		uu.email AS update_user_email,
		ap.created_at,
		ap.updated_at,
		ap.`status`,
		ap.active
	FROM admission_applications AS ap
	LEFT JOIN areas AS a ON a.id = ap.area_id
	LEFT JOIN patients AS p ON p.id = ap.patient_id
	LEFT JOIN users AS cu ON cu.id = ap.creation_user_id
	LEFT JOIN users AS uu ON uu.id = ap.update_user_id
	WHERE
		ap.id = IFNULL($admission_id,ap.id)
	ORDER BY ap.created_at DESC
	LIMIT `_offset`,_take;

END//
DELIMITER ;


DROP PROCEDURE SP_StoreUpdate_Patient;
DELIMITER //
CREATE PROCEDURE SP_StoreUpdate_Patient (
	IN $patient_id INT,
	IN $first_name VARCHAR(70),
	IN $paternal_surname VARCHAR(50),
	IN $maternal_surname VARCHAR(50),
	IN $birthday DATE,
	IN $gender VARCHAR(20),
	IN $marital_status VARCHAR(30),
	IN $sons INT,
	IN $brothers INT,
	IN $all_agree TINYINT,
	IN $native_city_id INT,
	IN $mobile_phone VARCHAR(20),
	IN $home_phone VARCHAR(20),
	IN $employment_id INT,
	IN $ssn VARCHAR(12),
	IN $health_institution VARCHAR(100),
	IN $social_program VARCHAR(100),
	IN $scholarship_id INT,
	IN $religion_id INT,
	IN $street VARCHAR(50),
	IN $house_number VARCHAR(10),
	IN $suburb VARCHAR(50),
	IN $city_id INT,
	IN $state_id INT,
	IN $comments TEXT,
	IN $user_id INT
)
BEGIN
	
	IF NOT EXISTS(SELECT 1 FROM patients AS p WHERE p.id = $patient_id AND p.active = 1) THEN
	BEGIN
		INSERT INTO patients (
			first_name,
			paternal_surname,
			maternal_surname,
			birthday,
			gender,
			marital_status,
			sons,
			brothers,
			all_agree,
			native_city_id,
			mobile_phone,
			home_phone,
			employment_id,
			ssn,
			health_institution,
			social_program,
			scholarship_id,
			religion_id,
			street,
			house_number,
			suburb,
			city_id,
			state_id,
			comments,
			creation_user_id,
			created_at
			)
		SELECT
			$first_name,
			$paternal_surname,
			$maternal_surname,
			$birthday,
			$gender,
			$marital_status,
			$sons,
			$brothers,
			$all_agree,
			$native_city_id,
			$mobile_phone,
			$home_phone,
			$employment_id,
			$ssn,
			$health_institution,
			$social_program,
			$scholarship_id,
			$religion_id,
			$street,
			$house_number,
			$suburb,
			$city_id,
			$state_id,
			$comments,
			$user_id,
			NOW();
		SELECT LAST_INSERT_ID();
	END;
	ELSE
	BEGIN
		
		UPDATE patients
			SET
			first_name = $first_name,
			paternal_surname = $paternal_surname,
			maternal_surname = $maternal_surname,
			birthday = $birthday,
			gender = $gender,
			marital_status = $marital_status,
			sons = $sons,
			brothers = $brothers,
			all_agree = $all_agree,
			native_city_id = $native_city_id,
			mobile_phone = $mobile_phone,
			home_phone = $home_phone,
			employment_id = $employment_id,
			ssn = $ssn,
			health_institution = $health_institution,
			social_program = $social_program,
			scholarship_id = $scholarship_id,
			religion_id = $religion_id,
			street = $street,
			house_number = $house_number,
			suburb = $suburb,
			city_id = $city_id,
			state_id = $state_id,
			comments = $comments,
			updated_at = NOW(),
			update_user_id = $user_id
			WHERE id = $patient_id;
			SELECT $patient_id;
		
	END;
	END IF;
	
END//
DELIMITER ;


DELETE PROCEDURE SP_Delete_Patient;
DELIMITER //
CREATE PROCEDURE SP_Delete_Patient (
	IN $patient_id INT,
	IN $user_id INT
)
BEGIN
	UPDATE patients
		SET
		active = 0,
		update_user_id = $user_id,
		updated_at = NOW()
	WHERE 
		id = $patient_id;
	SELECT $patient_id;
END//
DELIMITER ;



DROP PROCEDURE SP_ShowIndex_Patient;
DELIMITER //
CREATE PROCEDURE SP_ShowIndex_Patient(
	IN $patient_id INT,
	IN $take INT,
	IN `$offset` INT
)
BEGIN
	DECLARE _take BIGINT;
	DECLARE `_offset` BIGINT;
	SET _take = IFNULL($take,2147483647);
	SET _offset = IFNULL(`$offset`,0);
	SELECT
		p.id,
		p.first_name,
		p.paternal_surname,
		p.maternal_surname,
		p.birthday,
		p.gender,
		p.marital_status,
		p.sons,
		p.brothers,
		p.all_agree,
		p.native_city_id,
		nc.`name` AS native_city_name,
		p.home_phone,
		p.mobile_phone,
		p.employment_id,
		e.`name` AS employment_name,
		p.ssn,
		p.health_institution,
		p.social_program,
		p.scholarship_id,
		s.`name` AS scholarship_name,
		P.religion_id,
		r.`name` AS religion_name,
		p.street,
		p.house_number,
		p.suburb,
		p.city_id,
		c.`name` AS city_name,
		p.state_id,
		st.`name` AS state_name,
		p.comments,
		p.creation_user_id,
		cu.email AS creation_user_email,
		p.update_user_id,
		uu.email AS update_user_email,
		p.created_at,
		p.updated_at
	FROM patients AS p
	LEFT JOIN cities AS nc ON nc.id = p.native_city_id
	LEFT JOIN employments AS e ON e.id = p.employment_id
	LEFT JOIN scholarships AS s ON s.id = p.scholarship_id
	LEFT JOIN religions AS r ON r.id = p.religion_id
	LEFT JOIN cities AS c ON c.id = p.city_id
	LEFT JOIN states AS st ON st.id = p.state_id
	LEFT JOIN users AS cu ON cu.id = p.creation_user_id
	LEFT JOIN users AS uu ON uu.id = p.update_user_id
	WHERE
		p.id = IFNULL($patient_id,p.id) AND
		p.active = 1
	LIMIT _offset,_take;

END//
DELIMITER ;