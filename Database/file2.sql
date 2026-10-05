SELECT *FROM sos_reports;
SELECT *FROM authorities;

INSERT INTO authorities
(name, authority_type, phone, email, latitude, longitude, address, active)
VALUES
(
    'prithvi',
    'Police',
    '9907804865',
    'xyz@gmail.com',
    26.345621,
    89.448721,
    'Coochbehar',
    TRUE
);
INSERT INTO authorities
(name, authority_type, phone, email, latitude, longitude, address, active)
VALUES
(
    'Suvra',
    'DM',
    '8334973818',
    'suvra55cse@gmail.com',
    35.345621,
    49.448721,
    'kolkata',
    TRUE
);

-- DELETE FROM authorities 
-- WHERE id = 1;