-- RTI Tables Migration Script
-- Run this script to create the RTI officers and pay scales tables

-- Create RTI Officers table
CREATE TABLE IF NOT EXISTS rti_officers (
  id SERIAL PRIMARY KEY,
  sno INTEGER NOT NULL,
  category VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  designation TEXT NOT NULL,
  phone VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create RTI Pay Scales table
CREATE TABLE IF NOT EXISTS rti_pay_scales (
  id SERIAL PRIMARY KEY,
  sno INTEGER NOT NULL,
  category VARCHAR(255) NOT NULL,
  basic_pay VARCHAR(100),
  sgp6 VARCHAR(100),
  spp12_18 VARCHAR(100),
  spp24 VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rti_officers_sno ON rti_officers(sno);
CREATE INDEX IF NOT EXISTS idx_rti_officers_display_order ON rti_officers(display_order);
CREATE INDEX IF NOT EXISTS idx_rti_pay_scales_sno ON rti_pay_scales(sno);
CREATE INDEX IF NOT EXISTS idx_rti_pay_scales_display_order ON rti_pay_scales(display_order);

-- Insert sample RTI Officers data (optional - you can remove this if you want to add via admin)
INSERT INTO rti_officers (sno, category, name, designation, phone, display_order) VALUES
(1, 'HEAD OF THE DEPARTMENT', 'Ms. Charu Sinha, IPS.', 'Addl. Director General of Police, CID,TG, Hyd.', '04023242424', 1),
(2, 'Appellate Authority', 'SRI VISWAJIT KAMPATI, IPS.', 'SP.(Admin), CID, TG, Hyderabad.', '8712673678', 2),
(3, 'Public Information Officer', 'SRI B. RAM REDDY, IPS', 'SP NARCOTICS, CID,T.G, Hyderabad.', '8712592738', 3),
(4, 'Asst.Public Information Officer', 'Sri J.B.J. ANAND KUMAR', 'Administrative Officer, CID, T.G, Hyderabad.', '8712671789', 4)
ON CONFLICT DO NOTHING;

-- Insert sample RTI Pay Scales data (optional - you can remove this if you want to add via admin)
INSERT INTO rti_pay_scales (sno, category, basic_pay, sgp6, spp12_18, spp24, display_order) VALUES
(1, 'Superintendent of Police (N.C)', '56870-103290', '------', '------', '------', 1),
(2, 'Addl.Supdt of Police( N.C)', '52590-103290', '------', '------', '------', 2),
(3, 'Dy.Supdt of Police (including female Dy.S.P.)', '40270-93780', '42490-96110', '46060-98440', '49870-100770', 3),
(4, 'Chief Legal Advisor', '73270-108330', '80930-110850', '87130-110850', '------', 4),
(5, 'Legal Advisor', '42490-96110', '46060-98440', '49870-100770', '52590-103290', 5),
(6, 'Assistant Legal Advisor(CID)', '35120-87130', '37100-91450', '40270-93780', '42490-96110', 6),
(7, 'Audit Officer', '35120-87130', '37100-91450', '40270-93780', '42490-96110', 7),
(8, 'Asst. Audit Officer', '35120-87130', '37100-91450', '40270-93780', '42490-96110', 8),
(9, 'Administrative Officer', '37100-91450', '40270-93780', '42490-96110', '46060-98440', 9),
(10, 'Inspector of Police (including W.Inspr)', '35120-87130', '37100-91450', '40270-93780', '42490-96110', 10),
(11, 'Superintendent', '28940-78910', '29760-80930', '31460-84970', '35120-87130', 11),
(12, 'Sub-Inspector of Police (including WSI)', '28940-78910', '29760-80930', '31460-84970', '35120-87130', 12),
(13, 'Sub-Inspector of Police (FPB)', '28940-78910', '29760-80930', '31460-84870', '35120-87130', 13),
(14, 'Asst.Sub Inspr', '23100-67990', '25140-73270', '26600-77030', '28940-78910', 14),
(15, 'Senior Assistant', '22460-66330', '23100-67990', '25140-73270', '26600-77030', 15),
(16, 'Head Constable (Civil) (including WHC)', '21230-63010', '22460-66330', '23100-67990', '24460-67990', 16),
(17, 'Junior Assistant', '16400-49870', '17890-53950', '18400-55410', '19500-58330', 17),
(18, 'Junior Stenographer', '16400-49870', '17890-53950', '18400-55410', '19500-58330', 18),
(19, 'Typist', '16400-49870', '17890-53950', '18400-55410', '19500-58330', 19),
(20, 'Police Constable (FPB Photographer)', '16400-49870', '17890-53950', '18400-55410', '19500-58330', 20),
(21, 'Roneo Operator', '14600-44870', '15030-46060', '15460-47330', '16400-49870', 21),
(22, 'Record Assistant', '14600-44870', '15030-46060', '15460-47330', '16400-49870', 22),
(23, 'Sweeper', '13000-40270', '13390-41380', '13780-42490', '14600-44870', 23),
(24, 'Follower', '13000-40270', '13390-41380', '13780-42490', '14600-44870', 24)
ON CONFLICT DO NOTHING;

