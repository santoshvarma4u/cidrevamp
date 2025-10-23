--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: complaints; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    complaint_number character varying NOT NULL,
    type character varying NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    complainant_name character varying NOT NULL,
    complainant_email character varying,
    complainant_phone character varying,
    complainant_address text,
    status character varying DEFAULT 'pending'::character varying,
    priority character varying DEFAULT 'medium'::character varying,
    assigned_to character varying,
    attachments text[],
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.complaints OWNER TO ciduser;

--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complaints_id_seq OWNER TO ciduser;

--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    label character varying NOT NULL,
    url character varying,
    parent_id integer,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.menu_items OWNER TO ciduser;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO ciduser;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    excerpt text,
    featured_image character varying,
    category character varying DEFAULT 'general'::character varying,
    is_published boolean DEFAULT false,
    is_pinned boolean DEFAULT false,
    author_id character varying,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.news OWNER TO ciduser;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO ciduser;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    slug character varying NOT NULL,
    title text NOT NULL,
    content text,
    meta_title character varying,
    meta_description text,
    is_published boolean DEFAULT false,
    author_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    show_in_menu boolean DEFAULT false,
    menu_title character varying,
    menu_parent character varying,
    menu_order integer DEFAULT 0,
    menu_description text
);


ALTER TABLE public.pages OWNER TO ciduser;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pages_id_seq OWNER TO ciduser;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: photo_album_photos; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.photo_album_photos (
    id integer NOT NULL,
    album_id integer,
    photo_id integer,
    sort_order integer DEFAULT 0
);


ALTER TABLE public.photo_album_photos OWNER TO ciduser;

--
-- Name: photo_album_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.photo_album_photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photo_album_photos_id_seq OWNER TO ciduser;

--
-- Name: photo_album_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.photo_album_photos_id_seq OWNED BY public.photo_album_photos.id;


--
-- Name: photo_albums; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.photo_albums (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    cover_photo_id integer,
    is_published boolean DEFAULT false,
    created_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.photo_albums OWNER TO ciduser;

--
-- Name: photo_albums_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.photo_albums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photo_albums_id_seq OWNER TO ciduser;

--
-- Name: photo_albums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.photo_albums_id_seq OWNED BY public.photo_albums.id;


--
-- Name: photos; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.photos (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    category character varying DEFAULT 'operations'::character varying,
    is_published boolean DEFAULT false,
    uploaded_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.photos OWNER TO ciduser;

--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photos_id_seq OWNER TO ciduser;

--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.photos_id_seq OWNED BY public.photos.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO ciduser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'user'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    username character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.users OWNER TO ciduser;

--
-- Name: videos; Type: TABLE; Schema: public; Owner: ciduser
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    thumbnail_path character varying,
    duration integer,
    category character varying DEFAULT 'news'::character varying,
    is_published boolean DEFAULT false,
    uploaded_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.videos OWNER TO ciduser;

--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: ciduser
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_id_seq OWNER TO ciduser;

--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ciduser
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: photo_album_photos id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_album_photos ALTER COLUMN id SET DEFAULT nextval('public.photo_album_photos_id_seq'::regclass);


--
-- Name: photo_albums id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_albums ALTER COLUMN id SET DEFAULT nextval('public.photo_albums_id_seq'::regclass);


--
-- Name: photos id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photos ALTER COLUMN id SET DEFAULT nextval('public.photos_id_seq'::regclass);


--
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.complaints (id, complaint_number, type, subject, description, complainant_name, complainant_email, complainant_phone, complainant_address, status, priority, assigned_to, attachments, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.menu_items (id, label, url, parent_id, sort_order, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.news (id, title, content, excerpt, featured_image, category, is_published, is_pinned, author_id, published_at, created_at, updated_at) FROM stdin;
2	CEIR Tracing	More than Two Thousand (2,000) Lost/missing mobile devices have been traced/ recovered in a short span of less than 2 months from its launch & Handed over to rightful owners by using CEIR (Central Equipment Identity Register) portal by Telangana Police in association with Department of Telecommunication.\n\n		\N	general	t	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-28 21:24:44.807	2025-07-29 02:54:45.356603	2025-07-29 02:54:45.356603
3	Ist Duty Meet Telangana Police	Inauguration of Telangana's 1st Police\n\nDuty Meet by Dr. Jitender IPS @Telangana\n\nDGP at @RBVRR_TGPA, marks  beginning\n\nof a 4-day event featuring various competitions\n\nwith participation from #PoliceOfficers\n\nacross the state. These activities aim to\n\nfoster motivation &&; team spirit!		\N	general	t	f	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-28 21:27:44.358	2025-07-29 02:57:47.265856	2025-07-29 02:57:47.265856
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.pages (id, slug, title, content, meta_title, meta_description, is_published, author_id, created_at, updated_at, show_in_menu, menu_title, menu_parent, menu_order, menu_description) FROM stdin;
11	ncl	NCL	<h1>New Criminal Laws</h1><p><br></p><p>NCL - Important Documents and SOPs</p>			t	\N	2025-07-29 14:08:11.112298	2025-08-04 12:47:09.348	t	NCL		9	
3	about	About	<h1>About CID</h1><p>Information about the Criminal Investigation Department of Telangana State.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	ABOUT	\N	1	\N
5	media	Media	<h1>Media Center</h1><p>Latest news, photos, videos and media resources from CID Telangana.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	MEDIA	\N	3	\N
6	cases	Cases	<h1>Cases</h1><p>Information about ongoing and solved cases handled by CID Telangana.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	CASES	\N	4	\N
7	alerts	Alerts	<h1>Alerts</h1><p>Important alerts and notifications from CID Telangana.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	ALERTS	\N	5	\N
8	rti	RTI	<h1>Right to Information</h1><p>RTI guidelines, forms and procedures for information requests.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	RTI	\N	6	\N
9	links	Links	<h1>Important Links</h1><p>Useful links and resources related to law enforcement and citizen services.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	LINKS	\N	7	\N
10	contact	Contact	<h1>Contact Us</h1><p>Contact information and office details of CID Telangana.</p>	\N	\N	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	CONTACT	\N	8	\N
12	duty-meet	Telangana Police First Duty Meet	\n<div class="space-y-8">\n  <!-- Banner Section -->\n  <div class="bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-xl p-8 mb-12">\n    <div class="text-center">\n      <div class="mb-6">\n        <img src="/images/TSLogo_1754309846963.png" alt="Telangana Police Logo" class="h-24 w-auto mx-auto mb-4" />\n      </div>\n      <h1 class="text-4xl font-bold mb-4">Telangana Police First Duty Meet</h1>\n      <p class="text-xl text-teal-100">\n        The Duty Meet is scheduled to be organized in the month of October 2024 at the Telangana Police Academy, by CID, TG, Hyderabad.\n      </p>\n    </div>\n  </div>\n\n  <!-- Main Content -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-teal-100">\n    <div class="mb-8">\n      <div class="flex justify-end mb-6">\n        <a href="/dutymeet/UnitDutyMeetDetailMemo.pdf" \n           target="_blank" \n           class="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center gap-2">\n          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />\n          </svg>\n          MEMO of Duty Meet\n        </a>\n      </div>\n\n      <h2 class="text-2xl font-bold text-gray-800 mb-4">About the Duty Meet</h2>\n      <p class="text-gray-700 mb-6 leading-relaxed">\n        The Telangana State 1st Police Duty Meet will be held in the month of October 2024 at the Telangana Police Academy, organized by CID, Telangana, Hyderabad. The following events will take place during the meet:\n      </p>\n\n      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">\n        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">\n          <div class="flex items-center mb-3">\n            <div class="bg-teal-600 text-white p-2 rounded-full mr-3">\n              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />\n              </svg>\n            </div>\n            <h3 class="text-lg font-semibold text-teal-700">1. Scientific Aids to Investigation</h3>\n          </div>\n          <p class="text-gray-700 text-sm">Modern forensic techniques and scientific methods for criminal investigation</p>\n        </div>\n\n        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">\n          <div class="flex items-center mb-3">\n            <div class="bg-teal-600 text-white p-2 rounded-full mr-3">\n              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />\n              </svg>\n            </div>\n            <h3 class="text-lg font-semibold text-teal-700">2. Anti-Sabotage Check</h3>\n          </div>\n          <p class="text-gray-700 text-sm">Security protocols and bomb detection procedures for public safety</p>\n        </div>\n\n        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">\n          <div class="flex items-center mb-3">\n            <div class="bg-teal-600 text-white p-2 rounded-full mr-3">\n              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />\n              </svg>\n            </div>\n            <h3 class="text-lg font-semibold text-teal-700">3. Dog Squad Competition</h3>\n          </div>\n          <p class="text-gray-700 text-sm">K9 unit demonstrations and competitions showcasing police dog capabilities</p>\n        </div>\n\n        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">\n          <div class="flex items-center mb-3">\n            <div class="bg-teal-600 text-white p-2 rounded-full mr-3">\n              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />\n              </svg>\n            </div>\n            <h3 class="text-lg font-semibold text-teal-700">4. Computer Awareness</h3>\n          </div>\n          <p class="text-gray-700 text-sm">Digital literacy and cybercrime investigation techniques</p>\n        </div>\n\n        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">\n          <div class="flex items-center mb-3">\n            <div class="bg-teal-600 text-white p-2 rounded-full mr-3">\n              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />\n              </svg>\n            </div>\n            <h3 class="text-lg font-semibold text-teal-700">5. Photography</h3>\n          </div>\n          <p class="text-gray-700 text-sm">Crime scene photography and evidence documentation techniques</p>\n        </div>\n\n        <div class="bg-teal-50 rounded-lg p-6 border border-teal-200">\n          <div class="flex items-center mb-3">\n            <div class="bg-teal-600 text-white p-2 rounded-full mr-3">\n              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />\n              </svg>\n            </div>\n            <h3 class="text-lg font-semibold text-teal-700">6. Videography</h3>\n          </div>\n          <p class="text-gray-700 text-sm">Video documentation and digital evidence collection methods</p>\n        </div>\n      </div>\n\n      <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">\n        <p class="text-gray-700">\n          <strong>Note:</strong> The details with regard to syllabus and guidelines of each event are uploaded in the Telangana State Police Intranet Portal @ \n          <a href="/dutymeet/dutymeetsyllabus.pdf" target="_blank" class="text-teal-600 hover:text-teal-800 font-medium">\n            intranet.tspolice.gov.in\n          </a> \n          for your reference and guidance.\n        </p>\n      </div>\n    </div>\n  </div>\n\n  <!-- Event Details Section -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-teal-100">\n    <h2 class="text-2xl font-bold text-gray-800 mb-6">Event Information</h2>\n    \n    <div class="grid md:grid-cols-2 gap-8">\n      <div>\n        <h3 class="text-lg font-semibold text-teal-700 mb-4">📅 Schedule</h3>\n        <div class="space-y-3">\n          <div class="flex items-center">\n            <span class="font-medium text-gray-700 w-20">Month:</span>\n            <span class="text-gray-600">October 2024</span>\n          </div>\n          <div class="flex items-center">\n            <span class="font-medium text-gray-700 w-20">Venue:</span>\n            <span class="text-gray-600">Telangana Police Academy</span>\n          </div>\n          <div class="flex items-center">\n            <span class="font-medium text-gray-700 w-20">Organizer:</span>\n            <span class="text-gray-600">CID, Telangana, Hyderabad</span>\n          </div>\n        </div>\n      </div>\n\n      <div>\n        <h3 class="text-lg font-semibold text-teal-700 mb-4">📋 Resources</h3>\n        <div class="space-y-3">\n          <a href="/dutymeet/UnitDutyMeetDetailMemo.pdf" \n             target="_blank" \n             class="flex items-center text-teal-600 hover:text-teal-800 transition">\n            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />\n            </svg>\n            Download Duty Meet MEMO\n          </a>\n          <a href="/dutymeet/dutymeetsyllabus.pdf" \n             target="_blank" \n             class="flex items-center text-teal-600 hover:text-teal-800 transition">\n            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />\n            </svg>\n            Syllabus and Guidelines\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Contact Information -->\n  <div class="bg-teal-50 rounded-xl p-6 border border-teal-200">\n    <h3 class="text-lg font-semibold text-teal-700 mb-3">Contact Information</h3>\n    <div class="text-gray-700 space-y-2">\n      <p><strong>Organizing Department:</strong> Crime Investigation Department (CID)</p>\n      <p><strong>State:</strong> Telangana</p>\n      <p><strong>Email:</strong> addldgp-cid@tspolice.gov.in</p>\n      <p><strong>Phone:</strong> 040-27852274</p>\n    </div>\n  </div>\n</div>	Duty Meet - Telangana CID	Telangana Police First Duty Meet scheduled for October 2024 at Telangana Police Academy, organized by CID with events including Scientific Aids, Anti-Sabotage Check, Dog Squad Competition, and more.	t	\N	2025-07-29 14:08:11.112298	2025-07-29 14:08:11.112298	t	DUTY MEET	\N	8	\N
24	faqs	Frequently Asked Questions	<div class="space-y-8">\n    <div class="text-center mb-12">\n      <h1 class="text-4xl font-bold text-gray-800 mb-4"><br></h1>\n    </div>\n\n    <div class="space-y-6">\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What does CID do &amp; How?</h3>\n        <div class="text-gray-700 space-y-3">\n          <p>Investigation of cases of higher significance in terms of financial frauds, bodily and economic offences etc., and cases concerned to women protection and child safety etc.</p>\n          <p>It undertakes enquiries as per the instructions from DGP/Government/Precedence.</p>\n          <p>It is nodal agency for the state to monitor crime trends and give instructions for better management of crime on behalf of Director General of Police.</p>\n          <p>It is nodal agency to monitoring statistics of the State as well as SOPs for different modus operandi of crimes occurring in the state and ensures that they are followed scrupulously.</p>\n          <p>As per the G.O.No. 17 Dt. 07-08-2014 Declaration of Crime Investigation Department, Telangana as a Police Station, power conferred by clause (s) of section 2 of the Code of Criminal Procedure, 1973, the Government of Telangana hereby declare the Office of the Crime Investigation Department, Telangana, Hyderabad as Police Station for the entire State of Telangana.</p>\n          <p>After careful examination of the matter the Government hereby direct all the officers of the C.I.D to register the cases only when ordered by the competent authority, i.e., Government of Telangana represented by the Chief Secretary, Principal Secretary to Government, Home/D.G &amp; I.G of Police and Additional Director General of Police, C.I.D. Hyderabad</p>\n          <p>It is the bridging agency for various States and the Central Government Departments concerned with specialized wings viz., Narcotics, Protection of Civil Rights issues, Anti-Human Trafficking, Economic and General offences of higher promptitude etc.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">Who exercises supervision over CID?</h3>\n        <div class="text-gray-700">\n          <p>CID is one of the specialised institutions of the State police. It is headed by Addl. DGP, CID and is under the direct supervision of the DGP, TS, Hyderabad Head of the Department is DGP.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What are the Different wings in CID?</h3>\n        <div class="text-gray-700 space-y-3">\n          <p>From functional point of view, CID has been re-structured into five wings, having jurisdiction over the entire state, viz.:</p>\n          <ul class="list-disc list-inside space-y-1 ml-4">\n            <li><strong>A. ECONOMIC OFFENCES WING (EOW)</strong></li>\n            <li><strong>B. GENERAL OFFENCES WING (GOW)</strong></li>\n            <li><strong>C. STATE CRIME RECORD BUREAU (SCRB)</strong></li>\n            <li><strong>D. PROTECTION OF CIVIL RIGHTS (PCR)</strong></li>\n            <li><strong>E. WOMEN PROTECTION CELL (WPC)</strong></li>\n            <li><strong>F. CYBER CRIMES WING</strong></li>\n            <li><strong>G. PRC and FPB (Police Research Centre and Finger Print Bureau comes under SCRB)</strong></li>\n          </ul>\n          <p>Each wing is headed by an officer of the rank of IGP/DIG who is assisted by SsP/Addl.SsP. Apart from above Narcotics cases, Decoity cases, Counterfeit Currency cases, Video Piracy cases are being investigated and Nodal Agency for information dissemination.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What work does PCR Wing do?</h3>\n        <div class="text-gray-700">\n          <p>This Wing is headed by IGP, PCR, who looks after cases relating to PCR, AD Cell, Narcotic Cell, Human Rights Violations, Custodial Violence and Terrorist &amp; Extremist Crimes. He is assisted by SP, PCR Cell, who will look after Human Rights Violations and Custodial Violence SP AD Cell will look after Narcotics, Terrorist and Extremist Crime.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What work does Women Protection Cell WPC do?</h3>\n        <div class="text-gray-700 space-y-3">\n          <p>WPC deals with the issues of women &amp; Children. It is headed by IGP, WPC. WPC wing deals with cases relating to women harassment, dowry deaths, domestic violence, human trafficking, POCSO Act, Missing Children etc. WPC has a specialized AHTU i.e. Anti-Human Trafficking Unit.</p>\n          <p><strong>How Facial Recognition Technology is being adopted to trace the missing Children?</strong></p>\n          <p>The missing children data base available with Telangana Police is being matched with Facial Recognition App. Developed by Telangana Intelligence Department. It is the faster and easier way to trace the missing children. Let us upload the photograph or send a mail (photo) to CID website when you notice a child is lost or trafficked.</p>\n          <p><strong>Avail: Child Tracking App.</strong></p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What work does Cyber Crimes Wing do?</h3>\n        <div class="text-gray-700">\n          <p>This wing is headed by IGP(Cyber Crimes)/DIG who looks after the cases of Cyber Crimes, Video Piracy, and Intellectual Property Rights. He is assisted by SP(Cyber Crimes) and Addl.sp (Cyber Crime).</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What work does SCRB Wing do?</h3>\n        <div class="text-gray-700">\n          <p>This wing is headed by IGP (SCRB), who looks after State Crime Record Bureau (SCRB) &amp; Finger Print Bureau(FPB). He is assisted by SP, SCRB, under whom Addl. SP, SCRB/ PRC work ITP (SCRB) is assisted by Director FPB. The Wing will also deal with Interpol matters.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What are general guidelines for approaching CID for registration of crime?</h3>\n        <div class="text-gray-700">\n          <p>CID does not take up investigation of general and routine nature of crime as the Police forces of the State are meant to investigate such crime. CID Takes up cases requiring detailed investigation in terms of technology, forensic expertise and those which require investigation in other states and some times even abroad. Such cases are only taken up upon the orders of the Addl. DGP, CID or from a higher authority.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">Is it necessary for a person to physically approach a branch of CID providing information about crime?</h3>\n        <div class="text-gray-700">\n          <p>CID can be approached by also sending the information by post, by SMS from a mobile phone, by making a phone call to the concerned Branch, by sending emails to its officers. Phone Number: 04027852274. Email: adg_cid@tspolice.gov.in Don't hesitate to report any fraud to C.I.D. (with information)</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">Is it necessary to mention ones identity for giving information complaint to CID?</h3>\n        <div class="text-gray-700">\n          <p>Yes, But CID takes all the necessary care to ensure that identity of such persons is kept secret when an informant requires it.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What is the conviction rate in criminal cases prosecuted by CID?</h3>\n        <div class="text-gray-700">\n          <p>The conviction rate is high and it is at par with the best investigation agencies in India.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">Why does CID take so much time in investigation of cases?</h3>\n        <div class="text-gray-700">\n          <p>CID conducts investigations in the most professional manner. It lays great emphasis in use of technology during investigations and requires evaluation by forensic experts other experts. This often takes time. Many cases of CID often require investigation in other states and some times in abroad and hence collection of evidence depends on many external factors beyond the control of CID. In addition to above, there is multi-layer supervision in CID. The evidence collected is analyzed threadbare both by executive officers and law officers at multiple levels. Because of all these factors, CID investigations often take time. Of late a great emphasis is being laid in CID to complete investigations at the earliest.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">Does CID perform any other important function other than investigation of crime?</h3>\n        <div class="text-gray-700">\n          <p>Yes. CID actively organizes training modules in various subjects not only for its own officers but for officers from district police organizations, regional officers, banks about technical issues such as Cyber Crimes etc.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What is INTERPOL Cell?</h3>\n        <div class="text-gray-700">\n          <p>CID. T.S. Hyderabad has been identified as the Nodal agency for the State of Telangana for all matters relating to INTERPOL including initiating Extradition proceedings against an offender who escaped and residing in foreign countries or for taking up request of foreign countries for extradition of the offenders of their countries who are presently residing in the State of Telangana. Of late, the CID Interpol Cell has been receiving several requests from the unit officers to commence extradition proceedings against the fugitives registered in their cases. The C.I.D. will guide all the Unit Officers in the state for preparation of proper documentation required for commencing extradition procedure etc. The C.I.D. will process the matters relating to the issuance of Red Corner Notices, Look Out Circulars and Extradition matters etc.</p>\n        </div>\n      </div>\n\n      <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100">\n        <h3 class="text-lg font-semibold text-teal-700 mb-3">What is a Red Corner Notice?</h3>\n        <div class="text-gray-700">\n          <p>It is a notice published by the Interpol Headquarters at France on the request of a member country for tracing a fugitive in a criminal case by all the law enforcement agencies of the member countries. If such a fugitive is traced, the requesting country is informed for taking steps for extradition of the fugitive. In India RCN is issued by the CBI, Interpol Wing.</p>\n        </div>\n      </div>\n    </div>\n\n    <div class="mt-12 bg-teal-50 rounded-xl p-6">\n      <h3 class="text-lg font-semibold text-teal-700 mb-3">Contact Information</h3>\n      <div class="text-gray-700 space-y-2">\n        <p><strong>Phone:</strong> 040-27852274</p>\n        <p><strong>Email:</strong> adg_cid@tspolice.gov.in</p>\n        <p><strong>Address:</strong> 3rd Floor, DGP Office, Lakadikapul, Hyderabad-004</p>\n      </div>\n    </div>\n  </div>	FAQs - Telangana CID	Frequently asked questions about the Crime Investigation Department of Telangana State, including information about wings, procedures, and contact details.	t	\N	2025-08-04 13:07:48.115375	2025-08-07 11:27:00.156	t	FAQs	about	4	Common questions and answers about CID operations
16	photo-gallery	Photo Gallery	<p>Browse our collection of photos from CID operations, events, and activities.</p>	\N	View photos from Telangana State CID operations, events, training sessions and public awareness activities.	t	\N	2025-07-31 01:07:57.938335	2025-07-31 01:07:57.938335	t	Photo Gallery	media	1	\N
14	stracture	Organisation Stracture	<img src="/uploads/image-1753805769962-289513428.png" alt="orgstructure-new.png">			t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 16:16:42.898386	2025-07-29 16:16:49.73	t	Organisation Stracture	about	2	
17	video-gallery	Video Gallery	<p>Watch videos from CID operations, training sessions, and public awareness campaigns.</p>	\N	Watch videos from Telangana State CID operations, training sessions and public awareness campaigns.	t	\N	2025-07-31 01:07:57.938335	2025-07-31 01:07:57.938335	t	Video Gallery	media	2	\N
13	aboutcid	Functions and Duties of Officers in C.I.D.	<p></p>\n<p>Investigation of specified cases entrusted by the Government and DGP.</p>\n<p>Maintenance, updating and use of crime-criminal information system, crime and criminal records, planning and implementation of criminal intelligence and crime analysis to improve prevention, investigation and prosecution.</p>\n<p>Coordination of investigation in the State and with other States and National Institutions / Organisations dealing with crime investigation.</p>\n<p>Efficient, professional and independent functioning of SCRB, FPB and their modernization units.</p>\n<p>Report to DGP and Government on matters concerning the investigation and prosecution.</p>\n<p>The control, supervision and responsibility for efficient functioning of CID vests in Addl. DGP, CID, TS, Hyderabad.</p>\n<p>The main role of Addl. DGP, CID, TS is to ensure effective performance of one of the most vital functions of police, i.e., investigation and detection of cases in the State subject to the general control and supervision of the DGP.</p>\n<p>Responsible for efficient conduct, coordination and supervision of investigation in CID cases and for ensuring coordination with other States and National Agencies.</p>\n<p>To implement the schemes to employ latest advances in science and technology to upgrade investigative skills of police officers, build effective criminal records, criminal intelligence, crime analysis to improve the quality of investigation and prosecution, ensure integrity and impartiality in investigation.</p>\n<p>Addl. DGP, CID may entrust any case to any of the IOs in the region.</p>\n<p>The Chief Legal Advisor and other Legal Advisors will be mainly rendering legal advice and opinion in all cases investigated by CID.</p>\n<p>All the Wings and Zones will work under the direct control and supervision of the Addl. DGP, CID, TS, Hyderabad.</p>			t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 15:29:56.281775	2025-07-31 00:55:34.208	t	About CID	about	1	
26	transferred-cases	Transferred Cases to C.I.D	\n<div class="space-y-8">\n  <div class="text-center mb-12">\n    <h1 class="text-4xl font-bold text-gray-800 mb-4">Transferred Cases to C.I.D</h1>\n    <p class="text-lg text-gray-700">Cases transferred from various police stations to CID for investigation</p>\n  </div>\n\n  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-teal-100">\n    <!-- 2018 Cases -->\n    <div class="bg-teal-700 text-white p-4">\n      <h2 class="text-2xl font-bold text-center">2018</h2>\n    </div>\n    <div class="overflow-x-auto">\n      <table class="w-full border-collapse">\n        <thead class="bg-teal-100">\n          <tr>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-16 text-gray-800">Sl.No</th>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-32 text-gray-800">Crime No</th>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">Section of Law</th>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-48 text-gray-800">Transferred From</th>\n          </tr>\n        </thead>\n        <tbody class="bg-white">\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">1</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">1115/2017</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 420, 408 IPC</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">KPHB PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">2</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">945/2017</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 420, 206, 468, 471 IPC</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">KPHB PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">3</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">329/2017</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 420, 406, 418 r/w 3 IPC, 156(3) Cr.P.C</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Kukatpally PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">4</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">193/2018</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 406, 420 IPC, Sec. 5 of TPDFE Act-1999, Sec. 76 Chit Fund Act. 1982, Sec. 58-B(4-A) r/w 45-1A of RBI Act 1934</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Shankarpally PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">5</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">212/2018</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 406, 420 IPC, Sec. 5 of TPDFE Act. 1999, Sec. 76 Chit Fund Act-1982 r/w 45-1A of RBI Act 1934</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Shankarpally PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">6</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">213/2018</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 406, 420 IPC, Sec. 5 of TPDFE Act-1999, Sec. 76 Chit Fund Act-1982, Sec. 58-B(4-A) r/w 45-1A of RBI Act-1934</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Shankarpally PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">7</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">64/2016</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 324, 504, 506 r/w 34 IPC</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Mominpet PS, Vikarabad Dist.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <!-- 2017 Cases -->\n  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-teal-100 mt-8">\n    <div class="bg-teal-700 text-white p-4">\n      <h2 class="text-2xl font-bold text-center">2017</h2>\n    </div>\n    <div class="overflow-x-auto">\n      <table class="w-full border-collapse">\n        <thead class="bg-teal-100">\n          <tr>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-16 text-gray-800">Sl.No</th>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-32 text-gray-800">Crime No</th>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-800">Section of Law</th>\n            <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-48 text-gray-800">Transferred From</th>\n          </tr>\n        </thead>\n        <tbody class="bg-white">\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">1</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">583/2016</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 120-B, 420, 406 IPC, Sec. 5 of PDFE & 4, 5 r/w 2(c), 2PCMCS</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Uppal PS, Cyberabad</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">2</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">45/2015</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 406, 420 IPC, Sec. 3 & 5 of AP Protection of Depositors Financial Establishment Act. 1999</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Kothur PS, Mahaboobnagar Dist.</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">3</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">94/2015</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 406, 420 IPC, Sec. 3 & 5 of AP Protection of Depositors Financial Establishment Act. 1999</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Kothur PS, Mahaboobnagar Dist.</td>\n          </tr>\n          <tr class="hover:bg-gray-50">\n            <td class="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700">4</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">62/2015</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">U/s 406, 420 IPC, Sec. 3 & 5 of AP Protection of Depositors Financial Establishment Act. 1999</td>\n            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-700">Kothur PS, Mahaboobnagar Dist.</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n\n  <div class="mt-12 bg-teal-50 rounded-xl p-6 border border-teal-200">\n    <h3 class="text-lg font-semibold text-teal-700 mb-3">Note</h3>\n    <div class="text-gray-700 space-y-2">\n      <p>These cases have been transferred from various police stations across Telangana to the Crime Investigation Department for specialized investigation.</p>\n      <p>The cases are organized by year and include details of the original crime numbers, legal sections, and the transferring police stations.</p>\n      <p><strong>Contact:</strong> For information regarding transferred cases, contact CID at addldgp-cid@tspolice.gov.in</p>\n    </div>\n  </div>\n</div>	Transferred Cases - Telangana CID	Cases transferred from various police stations to the Crime Investigation Department of Telangana State for specialized investigation.	t	\N	2025-08-04 13:38:06.285241	2025-08-04 13:38:06.285241	t	Transferred Cases	cases	2	Cases transferred from police stations to CID
25	important-cases	Present Important Cases of C.I.D	<div class="space-y-8">\n    <div class="text-center mb-12">\n      <h1 class="text-4xl font-bold text-gray-800 mb-4">Present Important Cases of C.I.D</h1>\n      <p class="text-lg text-gray-700">Current significant cases under investigation by the Crime Investigation Department</p>\n    </div>\n\n    <div class="bg-white rounded-xl shadow-lg overflow-hidden">\n      <div class="overflow-x-auto">\n        <table class="w-full border-collapse">\n          <thead class="bg-teal-800 text-white">\n            <tr>\n              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-20">Sl.No</th>\n              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-32">Crime No</th>\n              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold w-48">Section of Law</th>\n              <th class="border border-gray-300 px-4 py-3 text-left text-sm font-semibold">Brief facts of the case</th>\n            </tr>\n          </thead>\n          <tbody class="bg-white">\n            <tr class="hover:bg-gray-50">\n              <td class="border border-gray-300 px-4 py-4 text-sm font-medium">1</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">187/2009</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">U/s 420, 419, 120(B) IPC</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm text-justify">The brief facts of the case are that involvement of pilot writers, mediators and the candidates to write the examination for selection of SCTPCs in Nalgonda District. During the investigation some more similar incidents also notices in large scale malpractice. The case was transferred from Thipparthy PS, Nalgonda District. Total (58) accused were arrested so far.</td>\n            </tr>\n            <tr class="hover:bg-gray-50">\n              <td class="border border-gray-300 px-4 py-4 text-sm font-medium">2</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">18/2016</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">U/s 420, 406, 408 IPC r/w 120-B IPC and Sec. 8 of A.P. Public Examinations (Prevention of Malpractices and Unfair means) Act, 1997 of CID PS, TS, Hyd.</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm text-justify">The Brief facts of the case are that on 25-07-2016 at 1630 hours, the petition of Dr.N.V. Ramana Rao, Convener, TS EAMCET-II, 2016 that some candidates are claiming that few candidates who appeared for EAMCET-II, 2016 examination have got good ranks in the examination held on 09-07-2016, even though their performance in other exams was very poor. There is a suspicion in leakage of EAMCET-II, 2016 question papers by some persons with the active collusion of parents of the students, coaching centers and the staff of the JNTUH and printing press people to enable some of the students to have illegal merit/Rank in the above examination. A prima facie case has been established regarding the question leakage pertaining to TS EAMCET-II, 2016, which held on 09-07-2016 against the responsible, which amounts to a cognizable offence of criminal breach of trust.</td>\n            </tr>\n            <tr class="hover:bg-gray-50">\n              <td class="border border-gray-300 px-4 py-4 text-sm font-medium">3</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">52/2017</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">U/s 406, 409, 420, 468, 120 (B) IPC of Bodhan Town PS, Nizamabad District now the case with CID, TS, Hyderabad.</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm text-justify">Brief Facts of the case are that on 02.02.2017 at 10 AM the complainant Sri L. Vijayender, Commercial Tax Officer Bodhan Circle reported that the enforcement staff of Commercial Tax Department have conducted a preliminary enquiry on 24th & 25th January-2017 and unearthed a scam of forged challans in Bodhan circle during the period from 2012-13 and 2013-14 by the accused S.L. Sivaraj Tax Consultant and his son S.V. Sunil are the main persons involved in the scam with the active connivance of the officials of Commercial Tax Department Sri Hanuman Sing Junior Assistant, Sri Venugopal swamy Senior assistant and Sri R.D. Vijaya Krishna, ACTO, Bodhan circle. That they created forged challans on behalf of the dealers, who had to pay their taxes, conveniently mixed them along with genuine challans by splitting the amount paid by the genuine dealers and transferred the credit to the other dealers. Thereby, the accused have resorted to fraudulent means to avoid payment of tax by managing the staff of CTO Bodhan circle. Accused have entered the full amount to the genuine dealers and also made multiple payment entries with same cheques to other dealers and caused huge loss to the Government exchequer.</td>\n            </tr>\n            <tr class="hover:bg-gray-50">\n              <td class="border border-gray-300 px-4 py-4 text-sm font-medium">4</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">7/2015</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">U/s 120-B, 420, 406 IPC, Sec. 5 of Protection of Depositors Financial Establishment Rules, 1999 and 4, 5 r/w 2(c), 3 of Prize Chits and Money Circulation Scheme (Banning Act) of 1978 of CID P.S., Hyderabad</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm text-justify">That the Agri Gold Estate Ltd. has engaged number of agents to propagate various schemes sponsored. The company and agents made false promises of getting matured amounts on the deposits and plots immediately after completion of the scheduled payments. The company gave colourful pictures about the schemes and modes of repayment. Believing their words Complainant along with his parents joined as members in recurring deposit scheme under which one has to pay Rs. 1000/- per month for five years and on maturity the amount will be Rs. 78,000/-. Complainant and his parents paid all the installments i.e. Rs. 1000/- per month and completed the scheme through one Mr. Kondapally Eshwar, agent of the company and gave their three bonds of the company worth Rs. 2,34,000/-. After four months they received three different cheques from the branch office of Agri Gold Company at Gadwal, Mahabubnagar district drawn on Punjab National Bank, Vijayawada. When they presented the said cheques at SBH, Gadwal they received a bank memo stating "insufficient funds" and got cheques bounced in June, 2014.</td>\n            </tr>\n            <tr class="hover:bg-gray-50">\n              <td class="border border-gray-300 px-4 py-4 text-sm font-medium">5</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">171/2013</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">U/s 120-B, 420, 406, 109 IPC, Sec. 5 of PDFE Rules, 1999 and 4, 5 r/w 2(c), 3 of Prize Chits and Money Circulation Scheme (Banning Act) of 1978 and Sec. 58 (s) of RBI Act of Kanagal PS, Nalgonda Dist., TS now with CID PS, Hyd.</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm text-justify">This is a court referred case. The Complainant Nadikuditi Srinivas Varma stating that he has received an ordinary post from one Sri K. Durga Rao of Thelakantigudem (V) and noticed that the Board of Directors of the company M/s Agri Gold Farms & Estates India P Ltd, Vijayawada have been promoting the illegal money circulation scheme and cheating the public in the name of Real Estate business. The company has also collecting unauthorized deposits from the public. Upon which, he has conducted preliminary enquiry into the matter and noticed that the scheme of the Agri-gold network company is 1:10 sponsoring scheme. The first person, who joined as member to the Agri Gold scheme, have to sponsor 10 persons as members under his leg. Thereafter, 10 persons should enroll 10 persons each under their leg. There are 12 levels in the scheme and different titles will be given.</td>\n            </tr>\n            <tr class="hover:bg-gray-50">\n              <td class="border border-gray-300 px-4 py-4 text-sm font-medium">6</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">583/2016</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm">U/s 120-B, 420, 406 IPC, Sec. 5 of Protection of Depositors Financial Establishment Rules, 1999 and 4, 5 r/w 2(c), 3 of Prize Chits and Money Circulation Scheme (Banning Act) of 1978 of Uppal PS, Rachakonda now with CID P.S., Hyd.</td>\n              <td class="border border-gray-300 px-4 py-4 text-sm text-justify">That one P. Kiran Kumaran, Mr. Kali Charan, approached the Complainant at her house during the period of October 2013 and December 2013, introduced themselves that they were working in Agrigold Farms and Estates as Agents in Dilsukh Nagar and Abids branches respectively and explained about the Agri Gold Farm Company and other projects like Agri Gold real estates, Agri Gold organics, Agri Gold properties and requested her to deposit the amount. After assured by the agents of the said company, she attracted for their rainbow picture in her hands and deposited the amount of Rs. 3,50,000/- in green ventures project on the name of Addepalli Rama Sita with various receipt numbers. After depositing the hard earned money of the complainant of Rs. 3.5 Lakhs, the complainant received only Rs. 7500/- as payout/dividend against the Receipt No. 1070/1070476867/LF No. 1999/2973 of the above investment of Rs. 50,000/- from January 2014 to March 2015 @ Rs. 500/- by the said persons and apart from the said amount of Rs. 7500/- in total, the Complainant has not received any other amount.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <div class="mt-12 bg-teal-50 rounded-xl p-6">\n      <h3 class="text-lg font-semibold text-teal-700 mb-3">Note</h3>\n      <div class="text-gray-700 space-y-2">\n        <p>These cases represent ongoing investigations by the Crime Investigation Department of Telangana State. The details provided are based on preliminary investigations and charges filed.</p>\n        <p><strong>Contact:</strong> For any information regarding these cases, please contact CID at addldgp-cid@tspolice.gov.in</p>\n      </div>\n    </div>\n  </div>	Important Cases - Telangana CID	Present important cases under investigation by the Crime Investigation Department of Telangana State, including details of charges and brief facts.	t	\N	2025-08-04 13:36:11.360176	2025-08-04 13:36:11.360176	t	Important Cases	cases	1	Current significant cases under CID investigation
15	officers	CID Senior Officers	\n<div class="space-y-8">\n  <!-- Header -->\n  <div class="text-center mb-12">\n    <h1 class="text-3xl font-bold text-gray-800 mb-4">CID Senior Officers</h1>\n    <p class="text-gray-600 max-w-2xl mx-auto">Meet the senior leadership of the Crime Investigation Department, Telangana State Police</p>\n  </div>\n\n  <!-- Officers Grid -->\n  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">\n\n    <!-- ADGP -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/charu-sinha-adgp.jpeg" \n             alt="Ms. CHARU SINHA, IPS" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">Ms. CHARU SINHA, IPS</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">ADGP,</p>\n        <p>Crime Investigation Department</p>\n        <p>Telangana</p>\n      </div>\n      <a href="mailto:addldgp-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        addldgp-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP CMS -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/naveen-kumar-sp.jpeg" \n             alt="Dr. B. NAVEEN KUMAR, IPS" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">Dr. B. NAVEEN KUMAR, IPS</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>Court Monitoring Cell (CMS)</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-cms-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-cms-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP Cybercrimes -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/gangaram-sp.jpeg" \n             alt="SRI B. GANGARAM" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI B. GANGARAM</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>Cybercrimes</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-ccps-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-ccps-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP GOW -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/srinivas-sp.jpeg" \n             alt="SRI. S. SRINIVAS" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI. S. SRINIVAS</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>General Offence Wing (GOW)</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-gow-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-gow-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- DIG SCRB -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/narayan-naik-dig.jpg" \n             alt="SRI K. NARAYAN NAIK, IPS" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI K. NARAYAN NAIK, IPS</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Dy. Inspector General of Police,</p>\n        <p>SCRB, CID, Hyderabad</p>\n        <p>Telangana</p>\n      </div>\n      <a href="mailto:digscrb-ts-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        digscrb-ts-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP Admin -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/viswajit-kampati-sp.png" \n             alt="SRI VISWAJIT KAMPATI, IPS" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI VISWAJIT KAMPATI, IPS</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>Admin</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-admin-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-admin-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP SCRB -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/bari-sp.jpeg" \n             alt="SRI M.A. BARI" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI M.A. BARI</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>State Crime Records Bureau (SCRB)</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-cybercrimes-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-cybercrimes-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP CoE -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/maddipati-srinivas-rao-sp.jpeg" \n             alt="SRI MADDIPATI SRINIVAS RAO" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI MADDIPATI SRINIVAS RAO</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>CoE</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-coe-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-coe-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP Narcotics -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/ram-reddy-sp.jpg" \n             alt="SRI B. RAM REDDY, IPS" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI B. RAM REDDY, IPS</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police</p>\n        <p>Narcotic Cell</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-narcotics-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-narcotics-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP PCR -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/anyonya-sp.jpg" \n             alt="SRI ANYONYA" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI ANYONYA</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>PCR Cell</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-pcr-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-pcr-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP AD Cell -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/kishan-singh-sp.jpeg" \n             alt="SRI D. KISHAN SINGH" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SRI D. KISHAN SINGH</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>AD Cell</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:sp-tsadcell-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        sp-tsadcell-cid@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- Director FPB - Moved to end -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/dharma-tata-rao-director.jpg" \n             alt="Sri M. DHARMA TATA RAO" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">Sri M. DHARMA TATA RAO</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Director,</p>\n        <p>Finger Print Bureau</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:director-fpb@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        director-fpb@tspolice.gov.in\n      </a>\n    </div>\n\n    <!-- SP EOW - Moved to end -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 text-center">\n      <div class="mb-6">\n        <img src="/uploads/officers/venkata-laxmi-kolli-sp.jpg" \n             alt="SMT VENKATA LAXMI KOLLI" \n             class="w-32 h-32 object-cover rounded-full mx-auto border-4 border-teal-200" />\n      </div>\n      <h3 class="text-lg font-bold text-gray-800 mb-2">SMT VENKATA LAXMI KOLLI</h3>\n      <div class="text-gray-700 mb-4">\n        <p class="font-medium">Superintendent of Police,</p>\n        <p>Economic Offences Wing (EOW)</p>\n        <p>CID, Telangana</p>\n      </div>\n      <a href="mailto:speow-cid@tspolice.gov.in" class="text-teal-600 hover:text-teal-800 text-sm">\n        speow-cid@tspolice.gov.in\n      </a>\n    </div>\n\n  </div>\n\n  <!-- Contact Information -->\n  <div class="bg-teal-50 rounded-xl p-6 border border-teal-200 mt-12">\n    <h3 class="text-lg font-semibold text-teal-700 mb-3">Contact Information</h3>\n    <div class="text-gray-700 space-y-2">\n      <p><strong>General Inquiries:</strong></p>\n      <p><strong>Email:</strong> addldgp-cid@tspolice.gov.in</p>\n      <p><strong>Phone:</strong> 040-27852274</p>\n      <p><strong>Address:</strong> Crime Investigation Department, Telangana State Police</p>\n    </div>\n  </div>\n</div>	CID Senior Officers - Telangana CID	Meet the senior officers and leadership team of the Crime Investigation Department of Telangana State, including contact information and department roles.	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-29 16:24:23.60866	2025-07-29 16:24:23.60866	t	Senior Officers	about	3	
28	cyber-crimes	Cyber Crimes	\n<div class="space-y-8">\n  <!-- Header -->\n  <div class="text-center mb-12">\n    <h1 class="text-3xl font-bold text-teal-800 mb-4">CYBER CRIMES</h1>\n    <p class="text-gray-600 max-w-4xl mx-auto">Specialized wing dealing with cyber offences and digital investigations</p>\n  </div>\n\n  <!-- Main Content -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-teal-100">\n    <div class="prose max-w-none">\n      <p class="text-lg leading-relaxed mb-6">\n        This Wing is headed by SP (Cyber Crimes) under the supervision of DIG and Addl. DGP, CID, TS. It is deemed to be a Police Station for the entire State of Telangana and deals with the offences on related to cyber-crimes, video piracy, under Information Technology Act. and copy rights Act. It will work under the direct supervision of DIG assisted by SP and other staff. Registration of Cyber Crime cases whenever a cognizable cyber-crime is reported under Information Technology Act with due permission from Addl. Director General of Police, CID.\n      </p>\n      \n      <p class="text-lg leading-relaxed mb-8">\n        Digital investigation with Forensic activity at digit an investigation lab. Procuring data from service providers such as Internet Service Providers. Mobile, Service Providers, Banks, Payment gateways, Webmail service providers, Social network service providers\n      </p>\n\n      <!-- Functions Section -->\n      <div class="bg-teal-50 rounded-lg p-6 mb-8">\n        <h2 class="text-2xl font-bold text-teal-800 mb-4">Functions and Duties of Cyber Crime Unit</h2>\n        <ul class="space-y-3 text-gray-700">\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Registration of Cyber Crime cases whenever a cognizable cyber-crime is reported under Information Technology Act with due permission from Addl. Director General of Police, CID.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            After registering the cases, some are handed over to Regional Officers of CID due to victim's presence in those areas.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Investigation of registered cases by CCPS officers and cases transferred from other units of the state.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Digital investigation with Forensic activity at digit an investigation lab. Procuring data from service providers such as Internet Service Providers. Mobile, Service Providers, Banks, Payment gateways, Webmail service providers, Social network service providers as per provisions in Sec. 91 Cr.P.C.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Collection of Oral, Electronic, Documentary and Circumstantial evidence to connect the offender to the offence.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Conducting outside state investigation in the cases, wherever necessary.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Collection of Intelligence in Under Investigation cases.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Forwarding Letters Rogatories for investigations abroad.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Supervising and monitoring trial of pending trail cases.\n          </li>\n          <li class="flex items-start">\n            <span class="text-teal-600 mr-2">•</span>\n            Petition enquiries entrusted by ADGP.\n          </li>\n        </ul>\n      </div>\n\n      <!-- Investigation Capabilities -->\n      <div class="bg-gray-50 rounded-lg p-6">\n        <h2 class="text-2xl font-bold text-teal-800 mb-4">Investigation Capabilities</h2>\n        <div class="grid md:grid-cols-2 gap-6">\n          <div>\n            <h3 class="font-semibold text-teal-700 mb-2">Digital Forensics</h3>\n            <p class="text-gray-700">Advanced digital investigation laboratory for forensic analysis</p>\n          </div>\n          <div>\n            <h3 class="font-semibold text-teal-700 mb-2">Data Procurement</h3>\n            <p class="text-gray-700">Coordination with ISPs, mobile operators, and payment gateways</p>\n          </div>\n          <div>\n            <h3 class="font-semibold text-teal-700 mb-2">International Cooperation</h3>\n            <p class="text-gray-700">Letters Rogatories for cross-border investigations</p>\n          </div>\n          <div>\n            <h3 class="font-semibold text-teal-700 mb-2">Evidence Collection</h3>\n            <p class="text-gray-700">Comprehensive evidence gathering from multiple sources</p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Contact Information -->\n  <div class="bg-teal-50 rounded-xl p-6 border border-teal-200">\n    <h3 class="text-lg font-semibold text-teal-700 mb-3">Contact Information</h3>\n    <div class="text-gray-700 space-y-2">\n      <p><strong>Superintendent of Police, Cyber Crimes:</strong> SRI B. GANGARAM</p>\n      <p><strong>Email:</strong> sp-ccps-cid@tspolice.gov.in</p>\n      <p><strong>Address:</strong> Cyber Crime Police Station, CID, Telangana State Police</p>\n    </div>\n  </div>\n</div>	\N	\N	f	\N	2025-08-04 15:09:00.926371	2025-08-04 15:09:00.926371	f	\N	cid-structure	2	\N
29	women-child-protection	Women & Child Protection	\n<div class="space-y-8">\n  <!-- Header -->\n  <div class="text-center mb-12">\n    <h1 class="text-3xl font-bold text-pink-800 mb-4">WOMEN PROTECTION CELL</h1>\n    <p class="text-gray-600 max-w-4xl mx-auto">Dedicated unit for crimes against women and children protection</p>\n  </div>\n\n  <!-- Units in WPC -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-pink-100 mb-8">\n    <h2 class="text-2xl font-bold text-pink-800 mb-6">UNITS IN WPC</h2>\n    <div class="space-y-4 text-gray-700">\n      <p class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        The WPC is headed by IGP.\n      </p>\n      <p class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        The SP, WPC coordinates the activities of the wings in the WPC.\n      </p>\n      <div class="ml-4">\n        <p class="font-semibold mb-2">There are three wings in WPC:</p>\n        <ol class="list-decimal list-inside space-y-2 ml-4">\n          <li>Crime Against Women wing</li>\n          <li>Crime Against Children wing</li>\n          <li>Anti-Human Trafficking Unit (AHTU)</li>\n        </ol>\n      </div>\n    </div>\n  </div>\n\n  <!-- Crime Against Women -->\n  <div class="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-8">\n    <h2 class="text-2xl font-bold text-pink-800 mb-4">CRIME AGAINST WOMEN</h2>\n    <ul class="space-y-3 text-gray-700">\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        This cell deals with all crimes against women: IPC and Special Laws\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        Cases are registered in CID on the directions of the High Court, on being referred by the DGP, and on the gravity of offence and sensational nature of case.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        The cases are mostly related to 498A IPC and Dowry Prohibition Act and also rape.\n      </li>\n    </ul>\n  </div>\n\n  <!-- Activities -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-pink-100 mb-8">\n    <h2 class="text-2xl font-bold text-pink-800 mb-6">ACTIVITIES OF WOMEN WING UNIT</h2>\n    <ul class="space-y-4 text-gray-700">\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        This wing is involved in preparing proposals for new laws, amendments to existing laws and formulation of policies.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        We had sent proposals for the Nirbhaya Act, amendments to the ITP Act, and also for victim compensation scheme and regulation on sale of acids.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        It acts as liaison between various departments/NGOs, Women Commissions etc. for issues related to women.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        It participates in and also arranges seminars and workshops on gender issues.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        The wing issues directions and circulars for the guidance of unit officers in dealing with cases of Crime Against Women.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        It also prepares standard operating procedures (SOPs) for dealing with Crime Against Women to have uniformity in procedures, especially when a new law is enacted.\n      </li>\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        It also initiates GOs on issues relating to crime against women.\n      </li>\n    </ul>\n  </div>\n\n  <!-- Recent Activities -->\n  <div class="bg-pink-50 rounded-xl p-6 border border-pink-200 mb-8">\n    <h2 class="text-2xl font-bold text-pink-800 mb-4">RECENT ACTIVITIES OF THE WOMEN UNIT</h2>\n    <ul class="space-y-3 text-gray-700">\n      <li class="flex items-start">\n        <span class="text-pink-600 mr-2">•</span>\n        Preparation of posters on various Crimes Against Women like stalking, acid attack, ragging, dowry related crimes like 498A, 304B, Indecent Representation of Women Act and Immoral Traffic (Prevention) Act etc. and to display in police stations.\n      </li>\n    </ul>\n  </div>\n\n  <!-- Contact Information -->\n  <div class="bg-pink-50 rounded-xl p-6 border border-pink-200">\n    <h3 class="text-lg font-semibold text-pink-700 mb-3">Contact Information</h3>\n    <div class="text-gray-700 space-y-2">\n      <p><strong>Women Protection Cell</strong></p>\n      <p><strong>Address:</strong> CID, Telangana State Police</p>\n      <p><strong>Phone:</strong> 040-27852274</p>\n    </div>\n  </div>\n</div>	\N	\N	f	\N	2025-08-04 15:09:24.296941	2025-08-04 15:09:24.296941	f	\N	cid-structure	3	\N
30	general-offences	General Offences Wing	\n<div class="space-y-8">\n  <!-- Header -->\n  <div class="text-center mb-12">\n    <h1 class="text-3xl font-bold text-red-800 mb-4">GENERAL OFFENCES WING</h1>\n    <p class="text-gray-600 max-w-4xl mx-auto">Handling grave crimes with state-level ramifications</p>\n  </div>\n\n  <!-- Main Content -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-red-100 mb-8">\n    <div class="prose max-w-none">\n      <p class="text-lg leading-relaxed mb-8">\n        This wing deals with specially grave crimes such as sensational heinous bodily offences, arson & riotings, fire accidents, explosives and terror activities etc. which has got state level ramifications.\n      </p>\n\n      <!-- Anti-Dacoity Cell -->\n      <div class="bg-red-50 rounded-lg p-6 mb-8">\n        <h2 class="text-2xl font-bold text-red-800 mb-4">a) Anti-Dacoity Cell</h2>\n        <div class="space-y-4 text-gray-700">\n          <p>\n            The Anti-Dacoity Cell was established in the year 1985 vide G.O.Ms.No. 178 Home (Police) Department, Dt:23-03-1985 to curb the raising tendency of dacoities and robberies in the state. It ensures that the IO's visit the scene of offence, raid the hide outs of the criminals and shift the accused from one court to the other.\n          </p>\n          <p>\n            The present task of the AD Cell, CID is to coordinate with local Police by providing expertise knowledge and experience in the investigation and detection of dacoity / robbery cases.\n          </p>\n        </div>\n      </div>\n\n      <!-- Narcotic Cell -->\n      <div class="bg-gray-50 rounded-lg p-6 mb-8">\n        <h2 class="text-2xl font-bold text-red-800 mb-4">b) Narcotic Cell</h2>\n        <div class="space-y-4 text-gray-700">\n          <p>\n            Since 1989 Narcotic Cell, CID has been functioning on the guidelines issued by the Government of India. A State level coordination committee on Narcotics is constituted to take effective steps for prevention and detection of cultivation and transportation of illicit drugs was formed in 2003 with Chief Secretary as Chairman, Addl.DGP, CID as Member Convener and six other members as per the instructions of the Government of India conveyed through National Crime Records Bureau(NCRB).\n          </p>\n        </div>\n      </div>\n\n      <!-- Areas of Operation -->\n      <div class="grid md:grid-cols-2 gap-6 mb-8">\n        <div class="bg-red-50 rounded-lg p-6">\n          <h3 class="text-xl font-bold text-red-700 mb-3">Crime Categories</h3>\n          <ul class="space-y-2 text-gray-700">\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Sensational heinous bodily offences\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Arson & riotings\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Fire accidents investigation\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Explosives related cases\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Terror activities\n            </li>\n          </ul>\n        </div>\n        \n        <div class="bg-gray-50 rounded-lg p-6">\n          <h3 class="text-xl font-bold text-red-700 mb-3">Specialized Units</h3>\n          <ul class="space-y-2 text-gray-700">\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Anti-Dacoity Cell (Since 1985)\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              Narcotic Cell (Since 1989)\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              State Coordination Committee\n            </li>\n            <li class="flex items-start">\n              <span class="text-red-600 mr-2">•</span>\n              NCRB Coordination Unit\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- Contact Information -->\n  <div class="bg-red-50 rounded-xl p-6 border border-red-200">\n    <h3 class="text-lg font-semibold text-red-700 mb-3">Contact Information</h3>\n    <div class="text-gray-700 space-y-2">\n      <p><strong>Superintendent of Police, GOW:</strong> SRI. S. SRINIVAS</p>\n      <p><strong>Email:</strong> sp-gow-cid@tspolice.gov.in</p>\n      <p><strong>Narcotic Cell SP:</strong> SRI B. RAM REDDY, IPS</p>\n      <p><strong>Email:</strong> sp-narcotics-cid@tspolice.gov.in</p>\n      <p><strong>Address:</strong> General Offences Wing, CID, Telangana State Police</p>\n    </div>\n  </div>\n</div>	\N	\N	f	\N	2025-08-04 15:09:46.118374	2025-08-04 15:09:46.118374	f	\N	cid-structure	4	\N
31	cid-structure	CID Structure	\n<div class="space-y-8">\n  <!-- Header -->\n  <div class="text-center mb-12">\n    <h1 class="text-3xl font-bold text-gray-800 mb-4">CID Structure</h1>\n    <p class="text-gray-600 max-w-2xl mx-auto">Organizational structure and specialized wings of the Crime Investigation Department</p>\n  </div>\n\n  <!-- Wings Grid -->\n  <div class="grid md:grid-cols-2 gap-8">\n    \n    <!-- Economic Offences Wing -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">\n      <div class="mb-4">\n        <h2 class="text-xl font-bold text-blue-800 mb-2">Economic Offences Wing (EOW)</h2>\n        <p class="text-gray-600 text-sm mb-4">\n          Handles major financial frauds, counterfeit currency cases, banking frauds, and money circulation schemes.\n        </p>\n      </div>\n      <div class="space-y-2 text-sm text-gray-700 mb-4">\n        <p><strong>Key Functions:</strong></p>\n        <ul class="list-disc list-inside space-y-1 text-xs">\n          <li>Financial fraud investigations</li>\n          <li>FICN monitoring and reporting</li>\n          <li>PMLA and FEMA cases</li>\n        </ul>\n      </div>\n      <a href="/economic-offences" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">\n        Learn More\n      </a>\n    </div>\n\n    <!-- Cyber Crimes -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-teal-100 hover:shadow-xl transition-shadow">\n      <div class="mb-4">\n        <h2 class="text-xl font-bold text-teal-800 mb-2">Cyber Crimes</h2>\n        <p class="text-gray-600 text-sm mb-4">\n          Specialized unit dealing with cyber offences, digital investigations, and Information Technology Act violations.\n        </p>\n      </div>\n      <div class="space-y-2 text-sm text-gray-700 mb-4">\n        <p><strong>Key Functions:</strong></p>\n        <ul class="list-disc list-inside space-y-1 text-xs">\n          <li>Digital forensics investigation</li>\n          <li>Cyber crime case registration</li>\n          <li>International cooperation</li>\n        </ul>\n      </div>\n      <a href="/cyber-crimes" class="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm">\n        Learn More\n      </a>\n    </div>\n\n    <!-- Women & Child Protection -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-shadow">\n      <div class="mb-4">\n        <h2 class="text-xl font-bold text-pink-800 mb-2">Women & Child Protection</h2>\n        <p class="text-gray-600 text-sm mb-4">\n          Dedicated unit for crimes against women and children with specialized wings and anti-trafficking unit.\n        </p>\n      </div>\n      <div class="space-y-2 text-sm text-gray-700 mb-4">\n        <p><strong>Key Functions:</strong></p>\n        <ul class="list-disc list-inside space-y-1 text-xs">\n          <li>Crime against women cases</li>\n          <li>Child protection services</li>\n          <li>Anti-human trafficking</li>\n        </ul>\n      </div>\n      <a href="/women-child-protection" class="inline-block bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm">\n        Learn More\n      </a>\n    </div>\n\n    <!-- General Offences Wing -->\n    <div class="bg-white rounded-xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-shadow">\n      <div class="mb-4">\n        <h2 class="text-xl font-bold text-red-800 mb-2">General Offences Wing</h2>\n        <p class="text-gray-600 text-sm mb-4">\n          Handles grave crimes including heinous offences, arson, explosives, and terror activities with state-level impact.\n        </p>\n      </div>\n      <div class="space-y-2 text-sm text-gray-700 mb-4">\n        <p><strong>Key Functions:</strong></p>\n        <ul class="list-disc list-inside space-y-1 text-xs">\n          <li>Anti-Dacoity Cell operations</li>\n          <li>Narcotic investigations</li>\n          <li>Terror activity cases</li>\n        </ul>\n      </div>\n      <a href="/general-offences" class="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">\n        Learn More\n      </a>\n    </div>\n\n  </div>\n\n  <!-- Additional Information -->\n  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-12">\n    <h3 class="text-lg font-semibold text-gray-700 mb-3">Organizational Structure</h3>\n    <div class="text-gray-700 space-y-2">\n      <p>The Crime Investigation Department is organized into specialized wings to handle different categories of crimes effectively.</p>\n      <p>Each wing operates under the supervision of specialized officers with expertise in their respective domains.</p>\n      <p>The structure ensures efficient investigation, coordination with other agencies, and proper case management.</p>\n    </div>\n  </div>\n</div>	\N	\N	f	\N	2025-08-04 15:10:22.279842	2025-08-04 15:10:22.279842	f	\N	\N	4	\N
27	economic-offences	Economic Offences Wing	\n<div class="space-y-8">\n  <!-- Header -->\n  <div class="text-center mb-12">\n    <h1 class="text-3xl font-bold text-blue-800 mb-4">ECONOMIC OFFENCES WING (EOW)</h1>\n    <p class="text-gray-600 max-w-4xl mx-auto">Specialized unit handling major financial frauds and economic crimes in Telangana State</p>\n  </div>\n\n  <!-- Main Content -->\n  <div class="bg-white rounded-xl shadow-lg p-8 border border-blue-100">\n    <div class="prose max-w-none">\n      <p class="text-lg leading-relaxed mb-6">\n        Economic Offences Wing (EOW) shall handle major cases of financial frauds and misappropriation, Counterfeit currency cases, Frauds by non-banking finance companies, Banking frauds, Multilevel marketing cases, Vanishing companies, Diversion/ Misappropriation of Government funds and Money circulation schemes which constitute a major chunk of economic Offences.\n      </p>\n      \n      <p class="text-lg leading-relaxed mb-6">\n        EOW is the Nodal Agency to supervise the cases of Fake Indian Currency Notes(FICN). Besides investigation of cases registered in CID, it monitors the data of FICN findings and shall send reports to National Investigation Agency (NIA) & Central Bureau of Investigation (CBI) periodically.\n      </p>\n      \n      <p class="text-lg leading-relaxed mb-8">\n        EOW is also the Nodal Agency which will report the cases pertaining to Prevention of Money Laundering Act (PMLA) & Foreign Exchange Management Act (FEMA), to the Enforcement Directorate.\n      </p>\n\n      <!-- Financial Frauds Section -->\n      <div class="bg-blue-50 rounded-lg p-6 mb-8">\n        <h2 class="text-2xl font-bold text-blue-800 mb-4">Financial Frauds</h2>\n        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">\n          <div class="bg-white rounded-lg p-4 border border-blue-200">\n            <h3 class="font-semibold text-blue-700 mb-2">Money Circulation Schemes</h3>\n            <p class="text-sm text-gray-600">Investigation of pyramid and Ponzi schemes</p>\n          </div>\n          <div class="bg-white rounded-lg p-4 border border-blue-200">\n            <h3 class="font-semibold text-blue-700 mb-2">Banking Frauds</h3>\n            <p class="text-sm text-gray-600">Cases involving financial institutions</p>\n          </div>\n          <div class="bg-white rounded-lg p-4 border border-blue-200">\n            <h3 class="font-semibold text-blue-700 mb-2">Counterfeit Currency</h3>\n            <p class="text-sm text-gray-600">FICN detection and investigation</p>\n          </div>\n        </div>\n      </div>\n\n      <!-- Acts & Judgements Section -->\n      <div class="bg-gray-50 rounded-lg p-6">\n        <h2 class="text-2xl font-bold text-blue-800 mb-4">Acts & Judgements</h2>\n        <p class="text-gray-700 mb-4">\n          The EOW operates under various acts and regulations including:\n        </p>\n        <ul class="list-disc list-inside space-y-2 text-gray-700">\n          <li>Prevention of Money Laundering Act (PMLA)</li>\n          <li>Foreign Exchange Management Act (FEMA)</li>\n          <li>Indian Penal Code provisions related to economic offences</li>\n          <li>Banking Regulation Act</li>\n        </ul>\n      </div>\n    </div>\n  </div>\n\n  <!-- Contact Information -->\n  <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">\n    <h3 class="text-lg font-semibold text-blue-700 mb-3">Contact Information</h3>\n    <div class="text-gray-700 space-y-2">\n      <p><strong>Superintendent of Police, EOW:</strong> SMT VENKATA LAXMI KOLLI</p>\n      <p><strong>Email:</strong> speow-cid@tspolice.gov.in</p>\n      <p><strong>Address:</strong> Economic Offences Wing, CID, Telangana State Police</p>\n    </div>\n  </div>\n</div>	\N	\N	f	\N	2025-08-04 15:08:36.14735	2025-08-04 15:08:36.14735	f	\N	cid-structure	1	\N
\.


--
-- Data for Name: photo_album_photos; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.photo_album_photos (id, album_id, photo_id, sort_order) FROM stdin;
\.


--
-- Data for Name: photo_albums; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.photo_albums (id, name, description, cover_photo_id, is_published, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.photos (id, title, description, file_name, file_path, category, is_published, uploaded_by, created_at, updated_at) FROM stdin;
14	CID		photo-1754307670198-668675833.jpg	uploads/photo-1754307670198-668675833.jpg	operations	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-08-04 11:41:10.230574	2025-08-04 11:41:10.230574
15	DGP		photo-1754307690771-85034930.jpg	uploads/photo-1754307690771-85034930.jpg	operations	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-08-04 11:41:30.787291	2025-08-04 11:41:30.787291
16	news		photo-1754307704871-824534706.jpg	uploads/photo-1754307704871-824534706.jpg	operations	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-08-04 11:41:44.885857	2025-08-04 11:41:44.885857
17	news1		photo-1754307720409-912769340.jpeg	uploads/photo-1754307720409-912769340.jpeg	operations	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-08-04 11:42:00.423605	2025-08-04 11:42:00.423605
18	CEIR		photo-1754307735685-579732142.jpg	uploads/photo-1754307735685-579732142.jpg	operations	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-08-04 11:42:15.69842	2025-08-04 11:42:15.69842
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.sessions (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, is_active, created_at, updated_at, username, password) FROM stdin;
3ed49eec-6033-4303-aa12-52054303f02a	admin@cid.tspolice.gov.in	System	Administrator	\N	admin	t	2025-07-26 03:32:54.645611	2025-07-26 03:32:54.645611	admin	6dbc45008f58b0b435b39e38d343f2026c5493fe798b5ea504ff2d1c24fe23b578ae4c76876fd5ed54bd8a60f1e37ac5c75a8e9971694e46a78a88fda5accb51.50c867b7674ab5e33862eecd76828168
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: ciduser
--

COPY public.videos (id, title, description, file_name, file_path, thumbnail_path, duration, category, is_published, uploaded_by, created_at, updated_at) FROM stdin;
4	Cyber Crime Awareness		video-1753923638214-106700488.mp4	uploads/video-1753923638214-106700488.mp4	\N	\N	awareness	t	3ed49eec-6033-4303-aa12-52054303f02a	2025-07-31 01:01:10.236027	2025-07-31 01:01:10.236027
\.


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.complaints_id_seq', 1, false);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 1, false);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.news_id_seq', 3, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.pages_id_seq', 31, true);


--
-- Name: photo_album_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.photo_album_photos_id_seq', 1, false);


--
-- Name: photo_albums_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.photo_albums_id_seq', 1, false);


--
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.photos_id_seq', 18, true);


--
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ciduser
--

SELECT pg_catalog.setval('public.videos_id_seq', 4, true);


--
-- Name: complaints complaints_complaint_number_unique; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_complaint_number_unique UNIQUE (complaint_number);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages pages_slug_unique; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_slug_unique UNIQUE (slug);


--
-- Name: photo_album_photos photo_album_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_album_photos
    ADD CONSTRAINT photo_album_photos_pkey PRIMARY KEY (id);


--
-- Name: photo_albums photo_albums_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_albums
    ADD CONSTRAINT photo_albums_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: ciduser
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: complaints complaints_assigned_to_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_assigned_to_users_id_fk FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: news news_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: pages pages_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- Name: photo_album_photos photo_album_photos_album_id_photo_albums_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_album_photos
    ADD CONSTRAINT photo_album_photos_album_id_photo_albums_id_fk FOREIGN KEY (album_id) REFERENCES public.photo_albums(id);


--
-- Name: photo_album_photos photo_album_photos_photo_id_photos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_album_photos
    ADD CONSTRAINT photo_album_photos_photo_id_photos_id_fk FOREIGN KEY (photo_id) REFERENCES public.photos(id);


--
-- Name: photo_albums photo_albums_cover_photo_id_photos_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_albums
    ADD CONSTRAINT photo_albums_cover_photo_id_photos_id_fk FOREIGN KEY (cover_photo_id) REFERENCES public.photos(id);


--
-- Name: photo_albums photo_albums_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photo_albums
    ADD CONSTRAINT photo_albums_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: photos photos_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: videos videos_uploaded_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: ciduser
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

