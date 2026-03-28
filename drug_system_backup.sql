--
-- PostgreSQL database dump
--

\restrict gTwalrWragloOlHvHZHTGRXJhOs3sjBBhLfiNanNCXRPyKDDDCph3eaN6AwGnCB

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: na_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_audit_log (
    audit_id bigint NOT NULL,
    actor_user_id text,
    action_code text NOT NULL,
    entity_name text NOT NULL,
    entity_id text,
    ip_addr text,
    user_agent text,
    detail jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_audit_log_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.na_audit_log_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: na_audit_log_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.na_audit_log_audit_id_seq OWNED BY public.na_audit_log.audit_id;


--
-- Name: na_member_drug_use; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_member_drug_use (
    drug_use_id text NOT NULL,
    member_id text NOT NULL,
    substance_code text NOT NULL,
    substance_name text,
    route_code text,
    first_use_age integer,
    use_frequency_code text,
    last_use_date date,
    injection_yn boolean DEFAULT false NOT NULL,
    overdose_history_yn boolean DEFAULT false NOT NULL,
    overdose_count integer,
    polysubstance_yn boolean DEFAULT false NOT NULL,
    abstinent_start_date date,
    severity_code text,
    memo text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_member_program_enroll; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_member_program_enroll (
    enroll_id text NOT NULL,
    member_id text NOT NULL,
    program_id text NOT NULL,
    enroll_date date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_code text DEFAULT 'ENROLLED'::text NOT NULL,
    drop_reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_member_referral; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_member_referral (
    referral_id text NOT NULL,
    member_id text NOT NULL,
    referral_type text NOT NULL,
    from_org text,
    to_org text,
    referral_date date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status_code text DEFAULT 'OPEN'::text NOT NULL,
    closed_date date,
    summary text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_member_session_attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_member_session_attendance (
    attendance_id text NOT NULL,
    enroll_id text NOT NULL,
    session_id text NOT NULL,
    attendance_code text NOT NULL,
    note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_member_test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_member_test (
    test_id text NOT NULL,
    member_id text NOT NULL,
    test_type_code text NOT NULL,
    test_date date NOT NULL,
    test_org_nm text,
    result_code text NOT NULL,
    result_detail jsonb,
    memo text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_program; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_program (
    program_id text NOT NULL,
    program_name text NOT NULL,
    program_type text NOT NULL,
    duration_weeks integer,
    memo text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: na_program_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.na_program_session (
    session_id text NOT NULL,
    program_id text NOT NULL,
    session_no integer NOT NULL,
    session_date timestamp(3) without time zone NOT NULL,
    location text,
    facilitator text,
    memo text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_audit_log (
    audit_id bigint NOT NULL,
    user_id text,
    table_nm text NOT NULL,
    record_id text NOT NULL,
    action text NOT NULL,
    old_data jsonb,
    new_data jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_audit_log_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_audit_log_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_audit_log_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_audit_log_audit_id_seq OWNED BY public.tb_audit_log.audit_id;


--
-- Name: tb_case; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_case (
    case_id bigint NOT NULL,
    subject_id text NOT NULL,
    center_id text,
    subject_label text NOT NULL,
    status text DEFAULT 'NEW'::text NOT NULL,
    triage text DEFAULT 'LOW'::text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by text
);


--
-- Name: tb_case_case_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_case_case_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_case_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_case_case_id_seq OWNED BY public.tb_case.case_id;


--
-- Name: tb_case_closing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_case_closing (
    closing_id bigint NOT NULL,
    case_id bigint NOT NULL,
    closing_type text NOT NULL,
    closing_date timestamp(3) without time zone NOT NULL,
    reason text,
    outcome text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_case_closing_closing_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_case_closing_closing_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_case_closing_closing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_case_closing_closing_id_seq OWNED BY public.tb_case_closing.closing_id;


--
-- Name: tb_case_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_case_event (
    event_id bigint NOT NULL,
    case_id bigint NOT NULL,
    event_type text NOT NULL,
    title text NOT NULL,
    note text,
    event_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_case_event_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_case_event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_case_event_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_case_event_event_id_seq OWNED BY public.tb_case_event.event_id;


--
-- Name: tb_case_monitoring; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_case_monitoring (
    monitor_id bigint NOT NULL,
    case_id bigint NOT NULL,
    monitor_at timestamp(3) without time zone NOT NULL,
    method text,
    condition text,
    note text,
    next_monitor timestamp(3) without time zone,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_case_monitoring_monitor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_case_monitoring_monitor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_case_monitoring_monitor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_case_monitoring_monitor_id_seq OWNED BY public.tb_case_monitoring.monitor_id;


--
-- Name: tb_case_support; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_case_support (
    support_id bigint NOT NULL,
    case_id bigint NOT NULL,
    support_type text NOT NULL,
    resource_id bigint,
    referral_date timestamp(3) without time zone,
    note text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_case_support_support_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_case_support_support_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_case_support_support_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_case_support_support_id_seq OWNED BY public.tb_case_support.support_id;


--
-- Name: tb_case_task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_case_task (
    task_id bigint NOT NULL,
    case_id bigint NOT NULL,
    title text NOT NULL,
    due_at timestamp(3) without time zone,
    status text DEFAULT 'TODO'::text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_case_task_task_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_case_task_task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_case_task_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_case_task_task_id_seq OWNED BY public.tb_case_task.task_id;


--
-- Name: tb_center; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_center (
    center_id text NOT NULL,
    center_nm text NOT NULL,
    region_cd text NOT NULL,
    address text,
    phone text,
    manager text,
    capacity integer DEFAULT 30 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: tb_closing_check_done; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_closing_check_done (
    done_id bigint NOT NULL,
    closing_id bigint NOT NULL,
    tpl_id bigint NOT NULL,
    done_yn boolean DEFAULT false NOT NULL,
    done_at timestamp(3) without time zone,
    done_by text
);


--
-- Name: tb_closing_check_done_done_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_closing_check_done_done_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_closing_check_done_done_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_closing_check_done_done_id_seq OWNED BY public.tb_closing_check_done.done_id;


--
-- Name: tb_closing_checklist_tpl; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_closing_checklist_tpl (
    tpl_id bigint NOT NULL,
    closing_type text NOT NULL,
    check_item text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: tb_closing_checklist_tpl_tpl_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_closing_checklist_tpl_tpl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_closing_checklist_tpl_tpl_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_closing_checklist_tpl_tpl_id_seq OWNED BY public.tb_closing_checklist_tpl.tpl_id;


--
-- Name: tb_closing_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_closing_history (
    closing_id bigint NOT NULL,
    closing_type text NOT NULL,
    period_label text NOT NULL,
    center_id text,
    status text DEFAULT 'OPEN'::text NOT NULL,
    closed_at timestamp(3) without time zone,
    closed_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_closing_history_closing_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_closing_history_closing_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_closing_history_closing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_closing_history_closing_id_seq OWNED BY public.tb_closing_history.closing_id;


--
-- Name: tb_code; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_code (
    group_cd text NOT NULL,
    code text NOT NULL,
    code_nm text NOT NULL,
    code_nm_en text,
    extra1 text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_code_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_code_group (
    group_cd text NOT NULL,
    group_nm text NOT NULL,
    description text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_connector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_connector (
    connector_id text NOT NULL,
    connector_nm text NOT NULL,
    group_cd text NOT NULL,
    endpoint_url text,
    status text DEFAULT 'OK'::text NOT NULL,
    last_sync_at timestamp(3) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_counseling; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_counseling (
    counsel_id bigint NOT NULL,
    case_id bigint NOT NULL,
    counsel_at timestamp(3) without time zone NOT NULL,
    duration integer,
    method text,
    summary text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_counseling_counsel_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_counseling_counsel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_counseling_counsel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_counseling_counsel_id_seq OWNED BY public.tb_counseling.counsel_id;


--
-- Name: tb_edu_legal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_edu_legal (
    edu_id bigint NOT NULL,
    subject_id text NOT NULL,
    legal_type text NOT NULL,
    court_nm text,
    order_date timestamp(3) without time zone,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    hours integer,
    status text DEFAULT 'SCHEDULED'::text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_edu_legal_attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_edu_legal_attendance (
    attend_id bigint NOT NULL,
    edu_id bigint NOT NULL,
    attend_date timestamp(3) without time zone NOT NULL,
    hours integer,
    note text
);


--
-- Name: tb_edu_legal_attendance_attend_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_edu_legal_attendance_attend_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_edu_legal_attendance_attend_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_edu_legal_attendance_attend_id_seq OWNED BY public.tb_edu_legal_attendance.attend_id;


--
-- Name: tb_edu_legal_edu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_edu_legal_edu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_edu_legal_edu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_edu_legal_edu_id_seq OWNED BY public.tb_edu_legal.edu_id;


--
-- Name: tb_edu_outreach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_edu_outreach (
    outreach_id bigint NOT NULL,
    outreach_date timestamp(3) without time zone NOT NULL,
    location text,
    staff_count integer,
    target_count integer,
    note text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_edu_outreach_outreach_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_edu_outreach_outreach_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_edu_outreach_outreach_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_edu_outreach_outreach_id_seq OWNED BY public.tb_edu_outreach.outreach_id;


--
-- Name: tb_edu_program; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_edu_program (
    program_id bigint NOT NULL,
    program_nm text NOT NULL,
    program_type text NOT NULL,
    center_id text,
    capacity integer,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_edu_program_program_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_edu_program_program_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_edu_program_program_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_edu_program_program_id_seq OWNED BY public.tb_edu_program.program_id;


--
-- Name: tb_edu_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_edu_session (
    session_id bigint NOT NULL,
    program_id bigint NOT NULL,
    session_date timestamp(3) without time zone NOT NULL,
    instructor text,
    location text,
    note text
);


--
-- Name: tb_edu_session_attend; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_edu_session_attend (
    attend_id bigint NOT NULL,
    session_id bigint NOT NULL,
    subject_id text NOT NULL,
    attended boolean DEFAULT true NOT NULL,
    note text
);


--
-- Name: tb_edu_session_attend_attend_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_edu_session_attend_attend_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_edu_session_attend_attend_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_edu_session_attend_attend_id_seq OWNED BY public.tb_edu_session_attend.attend_id;


--
-- Name: tb_edu_session_session_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_edu_session_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_edu_session_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_edu_session_session_id_seq OWNED BY public.tb_edu_session.session_id;


--
-- Name: tb_family; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_family (
    family_id bigint NOT NULL,
    subject_id text NOT NULL,
    relation text NOT NULL,
    phone_enc text,
    is_living boolean,
    consent_yn boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_family_family_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_family_family_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_family_family_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_family_family_id_seq OWNED BY public.tb_family.family_id;


--
-- Name: tb_faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_faq (
    faq_id bigint NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_faq_faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_faq_faq_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_faq_faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_faq_faq_id_seq OWNED BY public.tb_faq.faq_id;


--
-- Name: tb_form_template; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_form_template (
    form_id bigint NOT NULL,
    form_nm text NOT NULL,
    file_ext text,
    file_path text,
    version text,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by text
);


--
-- Name: tb_form_template_form_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_form_template_form_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_form_template_form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_form_template_form_id_seq OWNED BY public.tb_form_template.form_id;


--
-- Name: tb_intake; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_intake (
    intake_id bigint NOT NULL,
    intake_no text NOT NULL,
    source text NOT NULL,
    region_cd text,
    triage text DEFAULT 'LOW'::text NOT NULL,
    consent boolean DEFAULT false NOT NULL,
    summary text,
    preferred_center text,
    assigned_center text,
    intake_step text DEFAULT 'QUEUE'::text NOT NULL,
    subject_id text,
    converted_case_id bigint,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by text
);


--
-- Name: tb_intake_intake_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_intake_intake_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_intake_intake_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_intake_intake_id_seq OWNED BY public.tb_intake.intake_id;


--
-- Name: tb_intake_step_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_intake_step_log (
    log_id bigint NOT NULL,
    intake_id bigint NOT NULL,
    step text NOT NULL,
    done_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    done_by text,
    note text
);


--
-- Name: tb_intake_step_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_intake_step_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_intake_step_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_intake_step_log_log_id_seq OWNED BY public.tb_intake_step_log.log_id;


--
-- Name: tb_integration_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_integration_log (
    log_id bigint NOT NULL,
    connector_id text NOT NULL,
    direction text NOT NULL,
    message text,
    payload jsonb,
    result text NOT NULL,
    error_msg text,
    retry_count integer DEFAULT 0 NOT NULL,
    retried_from bigint,
    logged_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_integration_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_integration_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_integration_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_integration_log_log_id_seq OWNED BY public.tb_integration_log.log_id;


--
-- Name: tb_isp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_isp (
    isp_id bigint NOT NULL,
    case_id bigint NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    is_current boolean DEFAULT true NOT NULL,
    review_cycle text NOT NULL,
    crisis_plan text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by text
);


--
-- Name: tb_isp_goal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_isp_goal (
    goal_id bigint NOT NULL,
    isp_id bigint NOT NULL,
    horizon text NOT NULL,
    goal text NOT NULL,
    metric text,
    due timestamp(3) without time zone,
    status text DEFAULT 'IN_PROGRESS'::text NOT NULL
);


--
-- Name: tb_isp_goal_goal_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_isp_goal_goal_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_isp_goal_goal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_isp_goal_goal_id_seq OWNED BY public.tb_isp_goal.goal_id;


--
-- Name: tb_isp_intervention; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_isp_intervention (
    intervention_id bigint NOT NULL,
    isp_id bigint NOT NULL,
    category text NOT NULL,
    action text NOT NULL,
    owner text,
    schedule text
);


--
-- Name: tb_isp_intervention_intervention_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_isp_intervention_intervention_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_isp_intervention_intervention_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_isp_intervention_intervention_id_seq OWNED BY public.tb_isp_intervention.intervention_id;


--
-- Name: tb_isp_isp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_isp_isp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_isp_isp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_isp_isp_id_seq OWNED BY public.tb_isp.isp_id;


--
-- Name: tb_isp_problem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_isp_problem (
    problem_id bigint NOT NULL,
    isp_id bigint NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    problem text NOT NULL
);


--
-- Name: tb_isp_problem_problem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_isp_problem_problem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_isp_problem_problem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_isp_problem_problem_id_seq OWNED BY public.tb_isp_problem.problem_id;


--
-- Name: tb_member_basic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_basic (
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    org_rsrc_cd text,
    member_type_cd text,
    guardian_priority integer,
    guardian_rel_cd text,
    guardian_cohabit_yn text,
    guardian_support_cd text,
    nationality_cd text,
    member_nm text,
    rrn text,
    birth_dt text,
    age integer,
    gender_cd text,
    suicide_prev_yn text,
    local_office_no text,
    zip_cd text,
    addr1 text,
    addr2 text,
    addr_major_cd text,
    addr_minor_cd text,
    phone1 text,
    phone2 text,
    phone3 text,
    ext_phone1 text,
    ext_phone2 text,
    ext_phone3 text,
    edu_cd text,
    job_cd text,
    grade_cd text,
    econ_cd text,
    religion_cd text,
    family_type_cd text,
    ref_major_cd text,
    ref_minor_cd text,
    ref_sub_cd text,
    mental_dis_grade_cd text,
    mental_dis_yn text,
    other_dis_content text,
    family_content text,
    reg_major_cd text,
    diag_cd text,
    counsel_dt text,
    counsel_seq integer,
    pii_mod_dt timestamp(3) without time zone,
    pii_mod_id text,
    mgmt_dt timestamp(3) without time zone,
    remark text,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_member_diagnosis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_diagnosis (
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    input_dt text NOT NULL,
    diag_cd text NOT NULL,
    diag_nm text,
    diag_priority integer,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_member_eval_basic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_eval_basic (
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    biz_type_cd text NOT NULL,
    eval_dt text NOT NULL,
    eval_tool_cd text NOT NULL,
    eval_score integer,
    eval_summary text,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_member_eval_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_eval_detail (
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    biz_type_cd text NOT NULL,
    eval_dt text NOT NULL,
    eval_tool_cd text NOT NULL,
    eval_tool_det_cd text NOT NULL,
    eval_score integer,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_member_isp_assess_basic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_isp_assess_basic (
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    assess_seq integer NOT NULL,
    assess_dt text NOT NULL,
    biz_type_cd text,
    pii_mod_dt timestamp(3) without time zone,
    pii_mod_id text,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_member_linkage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_linkage (
    link_dt text NOT NULL,
    link_seq integer NOT NULL,
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    link_org_rsrc_cd text,
    link_svc_cd text,
    link_content text,
    link_result_cd text,
    link_end_dt timestamp(3) without time zone,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_member_medication; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_member_medication (
    member_reg_dt text NOT NULL,
    member_reg_seq integer NOT NULL,
    input_dt text NOT NULL,
    input_seq integer NOT NULL,
    prescribing_nm text,
    drug_nm_cd text,
    dosage_mgmt_cd text,
    compliance_cd text,
    side_effect_yn text,
    reg_org_cd text,
    reg_dt timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reg_id text,
    upd_org_cd text,
    upd_dt timestamp(3) without time zone NOT NULL,
    upd_id text
);


--
-- Name: tb_notice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_notice (
    notice_id bigint NOT NULL,
    title text NOT NULL,
    content text,
    is_important boolean DEFAULT false NOT NULL,
    center_id text,
    notice_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expire_date timestamp(3) without time zone,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_notice_notice_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_notice_notice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_notice_notice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_notice_notice_id_seq OWNED BY public.tb_notice.notice_id;


--
-- Name: tb_region; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_region (
    region_cd text NOT NULL,
    region_nm text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: tb_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_report (
    report_id bigint NOT NULL,
    report_type text NOT NULL,
    report_title text,
    period_from timestamp(3) without time zone,
    period_to timestamp(3) without time zone,
    center_id text,
    file_path text,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    submitted_at timestamp(3) without time zone,
    approved_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by text
);


--
-- Name: tb_report_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_report_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_report_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_report_report_id_seq OWNED BY public.tb_report.report_id;


--
-- Name: tb_resource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_resource (
    resource_id bigint NOT NULL,
    resource_nm text NOT NULL,
    resource_type text NOT NULL,
    region_cd text,
    phone text,
    address text,
    note text,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_resource_referral; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_resource_referral (
    referral_id bigint NOT NULL,
    resource_id bigint NOT NULL,
    case_id bigint NOT NULL,
    referral_date timestamp(3) without time zone NOT NULL,
    purpose text,
    result text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_resource_referral_referral_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_resource_referral_referral_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_resource_referral_referral_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_resource_referral_referral_id_seq OWNED BY public.tb_resource_referral.referral_id;


--
-- Name: tb_resource_resource_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_resource_resource_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_resource_resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_resource_resource_id_seq OWNED BY public.tb_resource.resource_id;


--
-- Name: tb_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_role (
    role_id text NOT NULL,
    role_nm text NOT NULL
);


--
-- Name: tb_stats_monthly; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_stats_monthly (
    stats_id bigint NOT NULL,
    yyyymm text NOT NULL,
    center_id text,
    region_cd text,
    intake_total integer DEFAULT 0 NOT NULL,
    intake_1342 integer DEFAULT 0 NOT NULL,
    intake_legal integer DEFAULT 0 NOT NULL,
    intake_agency integer DEFAULT 0 NOT NULL,
    intake_self integer DEFAULT 0 NOT NULL,
    case_new integer DEFAULT 0 NOT NULL,
    case_in_progress integer DEFAULT 0 NOT NULL,
    case_monitoring integer DEFAULT 0 NOT NULL,
    case_closed integer DEFAULT 0 NOT NULL,
    edu_legal_cnt integer DEFAULT 0 NOT NULL,
    edu_short_cnt integer DEFAULT 0 NOT NULL,
    edu_outreach_cnt integer DEFAULT 0 NOT NULL,
    counsel_cnt integer DEFAULT 0 NOT NULL,
    generated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_stats_monthly_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_stats_monthly_stats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_stats_monthly_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_stats_monthly_stats_id_seq OWNED BY public.tb_stats_monthly.stats_id;


--
-- Name: tb_subject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_subject (
    subject_id text NOT NULL,
    case_no text NOT NULL,
    alias text NOT NULL,
    gender text NOT NULL,
    birth_year integer NOT NULL,
    region_cd text NOT NULL,
    entry_route text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp(3) without time zone,
    registered_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by text
);


--
-- Name: tb_subject_drug; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_subject_drug (
    id bigint NOT NULL,
    subject_id text NOT NULL,
    drug_cd text NOT NULL,
    is_primary boolean DEFAULT false NOT NULL
);


--
-- Name: tb_subject_drug_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_subject_drug_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_subject_drug_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_subject_drug_id_seq OWNED BY public.tb_subject_drug.id;


--
-- Name: tb_subject_pii; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_subject_pii (
    subject_id text NOT NULL,
    full_name_enc text,
    rrn_enc text,
    phone_enc text,
    addr_enc text,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: tb_supporter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_supporter (
    supporter_id text NOT NULL,
    supporter_nm text NOT NULL,
    phone_enc text,
    center_id text,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tb_supporter_assignment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_supporter_assignment (
    assign_id bigint NOT NULL,
    supporter_id text NOT NULL,
    subject_id text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: tb_supporter_assignment_assign_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_supporter_assignment_assign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_supporter_assignment_assign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_supporter_assignment_assign_id_seq OWNED BY public.tb_supporter_assignment.assign_id;


--
-- Name: tb_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_user (
    user_id text NOT NULL,
    role_id text NOT NULL,
    center_id text,
    user_nm text NOT NULL,
    email text,
    pwd_hash text,
    is_active boolean DEFAULT true NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: tb_user_login_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tb_user_login_log (
    log_id bigint NOT NULL,
    user_id text NOT NULL,
    login_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_addr text,
    result text DEFAULT 'SUCCESS'::text NOT NULL
);


--
-- Name: tb_user_login_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tb_user_login_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tb_user_login_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tb_user_login_log_log_id_seq OWNED BY public.tb_user_login_log.log_id;


--
-- Name: na_audit_log audit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_audit_log ALTER COLUMN audit_id SET DEFAULT nextval('public.na_audit_log_audit_id_seq'::regclass);


--
-- Name: tb_audit_log audit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_audit_log ALTER COLUMN audit_id SET DEFAULT nextval('public.tb_audit_log_audit_id_seq'::regclass);


--
-- Name: tb_case case_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case ALTER COLUMN case_id SET DEFAULT nextval('public.tb_case_case_id_seq'::regclass);


--
-- Name: tb_case_closing closing_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_closing ALTER COLUMN closing_id SET DEFAULT nextval('public.tb_case_closing_closing_id_seq'::regclass);


--
-- Name: tb_case_event event_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_event ALTER COLUMN event_id SET DEFAULT nextval('public.tb_case_event_event_id_seq'::regclass);


--
-- Name: tb_case_monitoring monitor_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_monitoring ALTER COLUMN monitor_id SET DEFAULT nextval('public.tb_case_monitoring_monitor_id_seq'::regclass);


--
-- Name: tb_case_support support_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_support ALTER COLUMN support_id SET DEFAULT nextval('public.tb_case_support_support_id_seq'::regclass);


--
-- Name: tb_case_task task_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_task ALTER COLUMN task_id SET DEFAULT nextval('public.tb_case_task_task_id_seq'::regclass);


--
-- Name: tb_closing_check_done done_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_check_done ALTER COLUMN done_id SET DEFAULT nextval('public.tb_closing_check_done_done_id_seq'::regclass);


--
-- Name: tb_closing_checklist_tpl tpl_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_checklist_tpl ALTER COLUMN tpl_id SET DEFAULT nextval('public.tb_closing_checklist_tpl_tpl_id_seq'::regclass);


--
-- Name: tb_closing_history closing_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_history ALTER COLUMN closing_id SET DEFAULT nextval('public.tb_closing_history_closing_id_seq'::regclass);


--
-- Name: tb_counseling counsel_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_counseling ALTER COLUMN counsel_id SET DEFAULT nextval('public.tb_counseling_counsel_id_seq'::regclass);


--
-- Name: tb_edu_legal edu_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_legal ALTER COLUMN edu_id SET DEFAULT nextval('public.tb_edu_legal_edu_id_seq'::regclass);


--
-- Name: tb_edu_legal_attendance attend_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_legal_attendance ALTER COLUMN attend_id SET DEFAULT nextval('public.tb_edu_legal_attendance_attend_id_seq'::regclass);


--
-- Name: tb_edu_outreach outreach_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_outreach ALTER COLUMN outreach_id SET DEFAULT nextval('public.tb_edu_outreach_outreach_id_seq'::regclass);


--
-- Name: tb_edu_program program_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_program ALTER COLUMN program_id SET DEFAULT nextval('public.tb_edu_program_program_id_seq'::regclass);


--
-- Name: tb_edu_session session_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_session ALTER COLUMN session_id SET DEFAULT nextval('public.tb_edu_session_session_id_seq'::regclass);


--
-- Name: tb_edu_session_attend attend_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_session_attend ALTER COLUMN attend_id SET DEFAULT nextval('public.tb_edu_session_attend_attend_id_seq'::regclass);


--
-- Name: tb_family family_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_family ALTER COLUMN family_id SET DEFAULT nextval('public.tb_family_family_id_seq'::regclass);


--
-- Name: tb_faq faq_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_faq ALTER COLUMN faq_id SET DEFAULT nextval('public.tb_faq_faq_id_seq'::regclass);


--
-- Name: tb_form_template form_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_form_template ALTER COLUMN form_id SET DEFAULT nextval('public.tb_form_template_form_id_seq'::regclass);


--
-- Name: tb_intake intake_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake ALTER COLUMN intake_id SET DEFAULT nextval('public.tb_intake_intake_id_seq'::regclass);


--
-- Name: tb_intake_step_log log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake_step_log ALTER COLUMN log_id SET DEFAULT nextval('public.tb_intake_step_log_log_id_seq'::regclass);


--
-- Name: tb_integration_log log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_integration_log ALTER COLUMN log_id SET DEFAULT nextval('public.tb_integration_log_log_id_seq'::regclass);


--
-- Name: tb_isp isp_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp ALTER COLUMN isp_id SET DEFAULT nextval('public.tb_isp_isp_id_seq'::regclass);


--
-- Name: tb_isp_goal goal_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_goal ALTER COLUMN goal_id SET DEFAULT nextval('public.tb_isp_goal_goal_id_seq'::regclass);


--
-- Name: tb_isp_intervention intervention_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_intervention ALTER COLUMN intervention_id SET DEFAULT nextval('public.tb_isp_intervention_intervention_id_seq'::regclass);


--
-- Name: tb_isp_problem problem_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_problem ALTER COLUMN problem_id SET DEFAULT nextval('public.tb_isp_problem_problem_id_seq'::regclass);


--
-- Name: tb_notice notice_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_notice ALTER COLUMN notice_id SET DEFAULT nextval('public.tb_notice_notice_id_seq'::regclass);


--
-- Name: tb_report report_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_report ALTER COLUMN report_id SET DEFAULT nextval('public.tb_report_report_id_seq'::regclass);


--
-- Name: tb_resource resource_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_resource ALTER COLUMN resource_id SET DEFAULT nextval('public.tb_resource_resource_id_seq'::regclass);


--
-- Name: tb_resource_referral referral_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_resource_referral ALTER COLUMN referral_id SET DEFAULT nextval('public.tb_resource_referral_referral_id_seq'::regclass);


--
-- Name: tb_stats_monthly stats_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_stats_monthly ALTER COLUMN stats_id SET DEFAULT nextval('public.tb_stats_monthly_stats_id_seq'::regclass);


--
-- Name: tb_subject_drug id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_subject_drug ALTER COLUMN id SET DEFAULT nextval('public.tb_subject_drug_id_seq'::regclass);


--
-- Name: tb_supporter_assignment assign_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_supporter_assignment ALTER COLUMN assign_id SET DEFAULT nextval('public.tb_supporter_assignment_assign_id_seq'::regclass);


--
-- Name: tb_user_login_log log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_user_login_log ALTER COLUMN log_id SET DEFAULT nextval('public.tb_user_login_log_log_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Data for Name: na_audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_audit_log (audit_id, actor_user_id, action_code, entity_name, entity_id, ip_addr, user_agent, detail, created_at) FROM stdin;
\.


--
-- Data for Name: na_member_drug_use; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_member_drug_use (drug_use_id, member_id, substance_code, substance_name, route_code, first_use_age, use_frequency_code, last_use_date, injection_yn, overdose_history_yn, overdose_count, polysubstance_yn, abstinent_start_date, severity_code, memo, created_at) FROM stdin;
3e67ad89-628b-485d-8e97-e9347c1f59dd	SUBJ-2024-0001	METH	\N	INJECT	28	\N	2023-11-15	t	t	2	f	2023-12-01	SEVERE	\N	2026-03-05 06:06:24.171
a2b76949-d0cf-40d6-835e-8f710e24004f	SUBJ-2024-0002	THC	\N	INHALE	22	\N	2024-01-10	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.198
8d5c0ba7-dd3b-42b3-bda5-f66794b1837b	SUBJ-2024-0002	MDMA	\N	ORAL	25	\N	2023-12-28	f	f	\N	f	\N	MOD	\N	2026-03-05 06:06:24.2
153c09bc-acd7-466e-9b5e-3738ba3aa0be	SUBJ-2024-0003	HEROIN	\N	INJECT	30	\N	2024-01-20	t	t	1	f	2024-02-01	SEVERE	\N	2026-03-05 06:06:24.209
cb872bb4-b69b-4338-a555-e372c1593971	SUBJ-2024-0004	COCAINE	\N	INHALE	26	\N	2024-02-10	f	f	\N	f	\N	MOD	\N	2026-03-05 06:06:24.225
c501923c-6936-4e40-be58-96c5fd8bf812	SUBJ-2024-0005	MDMA	\N	ORAL	21	\N	2024-02-20	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.237
1911c0da-e4eb-4178-b8d4-d93b3ef72adf	SUBJ-2024-0006	METH	\N	INJECT	35	\N	2024-02-25	t	f	\N	f	\N	SEVERE	\N	2026-03-05 06:06:24.249
f53e2f64-72ab-4455-864f-26859b112e71	SUBJ-2024-0007	THC	\N	INHALE	30	\N	2024-03-15	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.259
27aef5bb-6817-4e15-b47e-4fc996e37127	SUBJ-2024-0008	FENTANYL	\N	INJECT	38	\N	2023-08-20	t	t	3	f	2023-09-01	SEVERE	\N	2026-03-05 06:06:24.268
fcbf6f04-5c31-4bce-8a20-c1d75900a14d	SUBJ-2024-0009	METH	\N	INJECT	24	\N	2024-04-01	t	f	\N	t	\N	MOD	\N	2026-03-05 06:06:24.284
b1d7c3f9-3c52-42ab-9eb4-44add1e4b140	SUBJ-2024-0009	HEROIN	\N	INJECT	26	\N	2024-03-15	t	t	1	f	\N	MOD	\N	2026-03-05 06:06:24.286
bd522490-ce3a-4c02-85a3-449efd6f8f75	SUBJ-2024-0010	COCAINE	\N	INHALE	25	\N	2024-04-10	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.298
333be846-ed86-4e2c-8d52-1b6454476777	SUBJ-2024-0011	METH	\N	INHALE	32	\N	2024-04-15	f	f	\N	f	\N	MOD	\N	2026-03-05 06:06:24.309
4f1c6225-5cff-4303-81c4-5c6ce90158b7	SUBJ-2024-0012	MDMA	\N	ORAL	23	\N	2024-04-28	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.323
ea0d0dd6-f8d0-4139-b18d-ce2ce1c57879	SUBJ-2024-0013	HEROIN	\N	INJECT	29	\N	2024-05-10	t	t	2	t	\N	SEVERE	\N	2026-03-05 06:06:24.336
daaab31a-1e80-4f1b-8bfb-50d32c6a5edd	SUBJ-2024-0014	THC	\N	INHALE	20	\N	2024-05-25	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.35
de8d13e9-52ec-4793-84fc-82fdc4b9e4f2	SUBJ-2024-0015	METH	\N	INJECT	40	\N	2023-05-20	t	f	\N	f	2023-06-01	SEVERE	\N	2026-03-05 06:06:24.361
1496ce82-87f6-4e2d-8424-2d6163db9359	SUBJ-2025-0001	METH	\N	INHALE	29	\N	2024-12-30	f	f	\N	f	\N	MOD	\N	2026-03-05 06:06:24.379
250cd7be-cf65-493e-a17c-ef7fddfd2d80	SUBJ-2025-0002	COCAINE	\N	INHALE	24	\N	2025-01-15	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.391
66d378bb-e562-4444-88c8-866efd5c4c4e	SUBJ-2025-0003	METH	\N	INJECT	33	\N	2025-02-05	t	t	1	t	\N	SEVERE	\N	2026-03-05 06:06:24.403
334aa1d3-8574-41a7-9dc1-1a46adfd92cd	SUBJ-2025-0004	THC	\N	ORAL	27	\N	2025-02-20	f	f	\N	f	\N	MILD	\N	2026-03-05 06:06:24.412
eb7eda61-96dd-45ec-87bd-b6e99bb240b5	SUBJ-2025-0005	FENTANYL	\N	INJECT	38	\N	2025-02-25	t	t	2	f	\N	SEVERE	\N	2026-03-05 06:06:24.421
\.


--
-- Data for Name: na_member_program_enroll; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_member_program_enroll (enroll_id, member_id, program_id, enroll_date, status_code, drop_reason, created_at) FROM stdin;
08f7c27d-9404-4e9e-8720-a23478981819	SUBJ-2024-0001	PROG-2024-CBT-001	2024-03-01	ENROLLED	\N	2026-03-05 06:06:24.788
bc0568fb-1c01-4ea7-8cdd-8b886b34ecb9	SUBJ-2024-0003	PROG-2024-CBT-001	2024-03-01	COMPLETED	\N	2026-03-05 06:06:24.792
bfd34e64-30aa-4f5f-898f-2d59f916ec10	SUBJ-2024-0006	PROG-2024-CBT-001	2024-03-01	DROPPED	개인 사정	2026-03-05 06:06:24.794
cc08bddb-942d-4e69-9fc8-3d423cbb97b8	SUBJ-2024-0009	PROG-2024-GRP-001	2024-04-01	ENROLLED	\N	2026-03-05 06:06:24.798
6caa404c-43b8-4cf2-abc7-d770575214a0	SUBJ-2024-0011	PROG-2024-GRP-001	2024-04-01	ENROLLED	\N	2026-03-05 06:06:24.8
bb90d490-28b4-4ae0-9966-1ba271ae8ac9	SUBJ-2024-0013	PROG-2024-GRP-001	2024-04-01	COMPLETED	\N	2026-03-05 06:06:24.803
d10f3e85-c86d-47ff-aecc-d1bd37ca4281	SUBJ-2024-0008	PROG-2024-RHB-001	2024-05-01	COMPLETED	\N	2026-03-05 06:06:24.805
4433ed46-7900-4870-aebb-4be0a9d14b3e	SUBJ-2024-0015	PROG-2024-RHB-001	2024-05-01	COMPLETED	\N	2026-03-05 06:06:24.807
9a6217a9-5db3-4466-bfad-e823b9908c66	SUBJ-2024-0002	PROG-2024-FAM-001	2024-06-01	ENROLLED	\N	2026-03-05 06:06:24.81
906ce49c-37fa-4cef-932f-8fdcb7e7d6ec	SUBJ-2024-0005	PROG-2024-FAM-001	2024-06-01	ENROLLED	\N	2026-03-05 06:06:24.813
18eca07b-5572-43c0-8e0f-754669bbee7d	SUBJ-2025-0001	PROG-2025-CBT-001	2025-01-15	ENROLLED	\N	2026-03-05 06:06:24.816
13653063-36c2-4886-83ec-0078ceae9548	SUBJ-2025-0003	PROG-2025-CBT-001	2025-02-15	ENROLLED	\N	2026-03-05 06:06:24.818
\.


--
-- Data for Name: na_member_referral; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_member_referral (referral_id, member_id, referral_type, from_org, to_org, referral_date, status_code, closed_date, summary, created_at) FROM stdin;
975e359a-41ca-4541-bf12-c6f9e6f998d6	SUBJ-2024-0001	IN	서울경찰청	\N	2024-01-08	CLOSED	\N	기소유예 조건부 상담 연계	2026-03-05 06:06:24.185
21f4e43d-95e3-496c-bd8c-61085aa6ca43	SUBJ-2024-0003	IN	수원지방법원	\N	2024-02-01	CLOSED	\N	집행유예 조건부 치료 명령	2026-03-05 06:06:24.215
ed049c8b-1d97-4f6a-8931-dc7c68a168d6	SUBJ-2024-0003	OUT	\N	수원정신건강복지센터	2024-03-15	IN_PROGRESS	\N	정신건강 서비스 연계	2026-03-05 06:06:24.216
f3cb3b51-23ba-4499-b654-5471bc41ea52	SUBJ-2024-0004	IN	인천정신건강복지센터	\N	2024-02-12	CLOSED	\N	기관 의뢰	2026-03-05 06:06:24.229
9a1ffbed-8e39-4441-923f-79ce327b9866	SUBJ-2024-0006	IN	대구지방검찰청	\N	2024-03-05	CLOSED	\N	기소유예 상담명령	2026-03-05 06:06:24.252
df8d1ec0-1670-47e0-a26d-42cfb4deda83	SUBJ-2024-0008	IN	대전중독관리통합지원센터	\N	2023-08-28	CLOSED	\N	자의 의뢰	2026-03-05 06:06:24.273
40afd065-aecf-473b-a597-91147ad8226f	SUBJ-2024-0008	RETURN	충남대학교병원	대전중독관리통합지원센터	2024-05-01	CLOSED	\N	치료 완료 후 회송	2026-03-05 06:06:24.275
5dc6f9ba-d883-46be-88ff-4fd9f4e7550a	SUBJ-2024-0011	IN	부산지방법원	\N	2024-04-18	CLOSED	\N	보호관찰 조건부 상담	2026-03-05 06:06:24.314
a120e4c0-7cff-4d09-b0fa-a3a94e946664	SUBJ-2024-0013	IN	은평구정신건강복지센터	\N	2024-05-13	CLOSED	\N	중독 위기 개입 연계	2026-03-05 06:06:24.34
b9709d16-6c7d-4427-8559-63cd0826bbed	SUBJ-2024-0013	OUT	\N	국립서울병원	2024-05-25	IN_PROGRESS	\N	입원 치료 연계	2026-03-05 06:06:24.342
bf47ba6e-225a-4073-88b3-900d0d80517e	SUBJ-2024-0015	IN	울산지방검찰청	\N	2023-05-25	CLOSED	\N	검찰 연계 치료명령	2026-03-05 06:06:24.371
1229f17f-cc9e-4613-80a0-a86a7c641754	SUBJ-2025-0003	IN	안산지방법원	\N	2025-02-07	CLOSED	\N	치료감호 조건부 연계	2026-03-05 06:06:24.405
0f97a345-3e11-443c-96bf-8b33c8125689	SUBJ-2025-0005	IN	전주1342센터	\N	2025-02-28	IN_PROGRESS	\N	자의 신고 후 연계	2026-03-05 06:06:24.423
\.


--
-- Data for Name: na_member_session_attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_member_session_attendance (attendance_id, enroll_id, session_id, attendance_code, note, created_at) FROM stdin;
\.


--
-- Data for Name: na_member_test; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_member_test (test_id, member_id, test_type_code, test_date, test_org_nm, result_code, result_detail, memo, created_at) FROM stdin;
92a427c9-4f98-4a7d-af4c-1055057c11d3	SUBJ-2024-0001	URINE	2024-01-15	국립과학수사연구원	POSITIVE	{"METH": "POSITIVE"}	\N	2026-03-05 06:06:24.177
42ab9a26-4396-4dd7-b4f7-5732bcf6152a	SUBJ-2024-0001	HAIR	2024-03-10	국립과학수사연구원	NEGATIVE	{"METH": "NEGATIVE"}	\N	2026-03-05 06:06:24.183
4a79ac4b-6cc8-4b57-be01-29cbaebdaed7	SUBJ-2024-0002	URINE	2024-01-25	부산의료원	POSITIVE	{"THC": "POSITIVE", "MDMA": "POSITIVE"}	\N	2026-03-05 06:06:24.202
2944a33e-a59c-4b13-80fa-5583d23037d6	SUBJ-2024-0003	BLOOD	2024-02-10	경기도의료원	POSITIVE	{"HEROIN": "POSITIVE"}	\N	2026-03-05 06:06:24.211
d8944f85-9456-48db-80c9-33649038f7ec	SUBJ-2024-0003	URINE	2024-04-10	경기도의료원	NEGATIVE	{"HEROIN": "NEGATIVE"}	\N	2026-03-05 06:06:24.213
2ae6d99c-e16c-41b1-8b17-72cba098cda7	SUBJ-2024-0004	SALIVA	2024-02-20	인천적십자병원	POSITIVE	{"COCAINE": "POSITIVE"}	\N	2026-03-05 06:06:24.227
8b72fa4a-73b0-428b-9c71-8583145e0cb8	SUBJ-2024-0005	URINE	2024-03-05	서울의료원	POSITIVE	{"MDMA": "POSITIVE"}	\N	2026-03-05 06:06:24.24
a3644c61-05f0-4a7a-83b4-f4b426558c22	SUBJ-2024-0005	URINE	2024-05-05	서울의료원	NEGATIVE	{"MDMA": "NEGATIVE"}	\N	2026-03-05 06:06:24.241
593c31f6-345e-42b6-8e3e-4f02dff4f8b6	SUBJ-2024-0006	HAIR	2024-03-15	대구가톨릭대학교병원	POSITIVE	{"METH": "POSITIVE"}	\N	2026-03-05 06:06:24.251
b046de0d-0c2a-4b57-b9ae-b34683d4f783	SUBJ-2024-0007	URINE	2024-03-25	광주기독병원	POSITIVE	{"THC": "POSITIVE"}	\N	2026-03-05 06:06:24.261
80c4bdde-37af-4250-8471-1f9302800067	SUBJ-2024-0008	BLOOD	2023-09-10	충남대학교병원	POSITIVE	{"FENTANYL": "POSITIVE"}	\N	2026-03-05 06:06:24.269
ec4f1387-4ddc-453e-b1bb-3628df8876cf	SUBJ-2024-0008	URINE	2024-01-10	충남대학교병원	NEGATIVE	{"FENTANYL": "NEGATIVE"}	\N	2026-03-05 06:06:24.271
d7e3450d-e80e-4ad9-a5ee-91406a039867	SUBJ-2024-0008	HAIR	2024-04-10	충남대학교병원	NEGATIVE	{"FENTANYL": "NEGATIVE"}	\N	2026-03-05 06:06:24.272
d53a3597-ba61-4a6c-a4e0-742d29712843	SUBJ-2024-0009	URINE	2024-04-10	분당서울대학교병원	POSITIVE	{"METH": "POSITIVE", "HEROIN": "POSITIVE"}	\N	2026-03-05 06:06:24.289
616392a8-542c-4569-8428-88273c7d84bb	SUBJ-2024-0010	SALIVA	2024-04-18	서울아산병원	POSITIVE	{"COCAINE": "POSITIVE"}	\N	2026-03-05 06:06:24.3
3df6ade2-a6b8-4ab5-8ce9-36f5129fdf58	SUBJ-2024-0011	URINE	2024-04-25	부산대학교병원	POSITIVE	{"METH": "POSITIVE"}	\N	2026-03-05 06:06:24.311
0cecef47-f2e9-45c7-a5b1-1acdfb426583	SUBJ-2024-0011	URINE	2024-07-25	부산대학교병원	INCONCLUSIVE	{"METH": "INCONCLUSIVE"}	\N	2026-03-05 06:06:24.312
0bf271b6-c8c4-481f-972c-a529f6805f4b	SUBJ-2024-0012	URINE	2024-05-08	인하대학교병원	POSITIVE	{"MDMA": "POSITIVE"}	\N	2026-03-05 06:06:24.325
33cc6ebb-672c-4929-8a9f-bc52991b57e8	SUBJ-2024-0013	BLOOD	2024-05-20	서울대학교병원	POSITIVE	{"HEROIN": "POSITIVE", "FENTANYL": "POSITIVE"}	\N	2026-03-05 06:06:24.338
ce4d2103-03e2-49c0-bf54-1debb9a31355	SUBJ-2024-0014	URINE	2024-06-05	화성시의료원	POSITIVE	{"THC": "POSITIVE"}	\N	2026-03-05 06:06:24.352
f8d9988f-7408-4b85-8fed-b3c924364bcd	SUBJ-2024-0015	URINE	2023-06-10	울산대학교병원	POSITIVE	{"METH": "POSITIVE"}	\N	2026-03-05 06:06:24.364
9bac4ab8-1195-4425-a6d0-a584c3174a8e	SUBJ-2024-0015	URINE	2023-09-10	울산대학교병원	NEGATIVE	{"METH": "NEGATIVE"}	\N	2026-03-05 06:06:24.367
bde7b873-1c64-46b6-8e75-8e89bc154c00	SUBJ-2024-0015	HAIR	2024-03-10	울산대학교병원	NEGATIVE	{"METH": "NEGATIVE"}	\N	2026-03-05 06:06:24.369
e654d299-a543-4e73-b673-fc02e9f891d0	SUBJ-2025-0001	URINE	2025-01-15	국립과학수사연구원	POSITIVE	{"METH": "POSITIVE"}	\N	2026-03-05 06:06:24.381
1b263a81-223a-4075-a58b-3551191e8d41	SUBJ-2025-0002	SALIVA	2025-01-25	부산의료원	POSITIVE	{"COCAINE": "POSITIVE"}	\N	2026-03-05 06:06:24.393
073842cc-0cbf-4c81-ae33-e326497bd66a	SUBJ-2025-0003	URINE	2025-02-15	안산중앙병원	POSITIVE	{"METH": "POSITIVE", "COCAINE": "POSITIVE"}	\N	2026-03-05 06:06:24.404
a0a1f245-1d25-4c5e-b584-89e0f0e6b8ac	SUBJ-2025-0004	URINE	2025-03-01	경북대학교병원	POSITIVE	{"THC": "POSITIVE"}	\N	2026-03-05 06:06:24.414
f36e30d9-33f6-445b-a9c1-82242c31eeef	SUBJ-2025-0005	BLOOD	2025-03-05	전북대학교병원	POSITIVE	{"FENTANYL": "POSITIVE"}	\N	2026-03-05 06:06:24.422
\.


--
-- Data for Name: na_program; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_program (program_id, program_name, program_type, duration_weeks, memo, created_at) FROM stdin;
PROG-2024-CBT-001	인지행동치료 기초 12주	CBT	12	마약류 중독 회복 CBT	2026-03-05 06:06:24.731
PROG-2024-GRP-001	회복 지지 집단상담	GROUP	8	동료 지지 집단 회복	2026-03-05 06:06:24.736
PROG-2024-RHB-001	재활 직업훈련 프로그램	REHAB	16	사회 복귀 직업 기술 훈련	2026-03-05 06:06:24.739
PROG-2024-FAM-001	가족 교육 및 지지	FAMILY	6	중독자 가족 심리교육	2026-03-05 06:06:24.743
PROG-2025-CBT-001	고강도 CBT 집중 과정	CBT	20	중증 중독자 대상 집중 CBT	2026-03-05 06:06:24.746
\.


--
-- Data for Name: na_program_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.na_program_session (session_id, program_id, session_no, session_date, location, facilitator, memo, created_at) FROM stdin;
2f83d1ca-bb1b-427e-a86a-9b16323f7fa3	PROG-2024-CBT-001	1	2024-03-04 00:00:00	서울중독재활센터 3층	김상담	\N	2026-03-05 06:06:24.753
65405f55-d2d1-4363-9e0c-8c6460372855	PROG-2024-CBT-001	2	2024-03-11 00:00:00	서울중독재활센터 3층	김상담	\N	2026-03-05 06:06:24.756
2409c342-e80b-4343-97ac-9852d8bf7ae1	PROG-2024-CBT-001	3	2024-03-18 00:00:00	서울중독재활센터 3층	김상담	\N	2026-03-05 06:06:24.758
a000d060-8ffe-43b4-9fca-9d9a681db05d	PROG-2024-CBT-001	4	2024-03-25 00:00:00	서울중독재활센터 3층	김상담	\N	2026-03-05 06:06:24.761
3e0dbe5f-bc0d-45f1-a95a-3f874faab249	PROG-2024-GRP-001	1	2024-04-02 00:00:00	경기중독재활센터 집단상담실	이상담	\N	2026-03-05 06:06:24.764
5941de93-0d50-4f43-b28f-99e6de33bbe1	PROG-2024-GRP-001	2	2024-04-09 00:00:00	경기중독재활센터 집단상담실	이상담	\N	2026-03-05 06:06:24.766
d10f2f0c-75bc-4a95-8fff-3e89c72cc3a7	PROG-2024-GRP-001	3	2024-04-16 00:00:00	경기중독재활센터 집단상담실	이상담	\N	2026-03-05 06:06:24.768
f2ea7b9f-2609-42ee-a4ed-9b7654f598f7	PROG-2024-RHB-001	1	2024-05-06 00:00:00	부산중독재활센터 교육실	박강사	\N	2026-03-05 06:06:24.771
1cf351e5-94e2-4fcb-a498-5c0ac3d95ff3	PROG-2024-RHB-001	2	2024-05-13 00:00:00	부산중독재활센터 교육실	박강사	\N	2026-03-05 06:06:24.773
c62dcf2c-7dc1-4c4c-89d2-251ee3c10b02	PROG-2024-FAM-001	1	2024-06-03 00:00:00	서울중독재활센터 대강당	최교육	\N	2026-03-05 06:06:24.777
ed3f3cb0-724c-4ae4-8bb7-8ca2af734cc1	PROG-2024-FAM-001	2	2024-06-10 00:00:00	서울중독재활센터 대강당	최교육	\N	2026-03-05 06:06:24.78
d50c6671-6175-4cf3-bfc6-9e65b02648cd	PROG-2025-CBT-001	1	2025-02-03 00:00:00	경기중독재활센터 3층	정상담	\N	2026-03-05 06:06:24.782
b6f8118c-48a5-4fc0-b16f-74814866f18a	PROG-2025-CBT-001	2	2025-02-10 00:00:00	경기중독재활센터 3층	정상담	\N	2026-03-05 06:06:24.784
\.


--
-- Data for Name: tb_audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_audit_log (audit_id, user_id, table_nm, record_id, action, old_data, new_data, created_at) FROM stdin;
\.


--
-- Data for Name: tb_case; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_case (case_id, subject_id, center_id, subject_label, status, triage, is_deleted, deleted_at, created_at, updated_at, created_by) FROM stdin;
1	SUBJ-2024-0001	CTR-SEO-001	가나01	IN_PROGRESS	HIGH	f	\N	2026-03-05 06:06:24.545	2026-03-05 06:06:24.545	\N
2	SUBJ-2024-0002	CTR-BUS-001	나다02	IN_PROGRESS	MID	f	\N	2026-03-05 06:06:24.565	2026-03-05 06:06:24.565	\N
3	SUBJ-2024-0003	CTR-GGI-001	다라03	MONITORING	HIGH	f	\N	2026-03-05 06:06:24.577	2026-03-05 06:06:24.577	\N
4	SUBJ-2024-0004	CTR-ICN-001	라마04	IN_PROGRESS	MID	f	\N	2026-03-05 06:06:24.596	2026-03-05 06:06:24.596	\N
5	SUBJ-2024-0005	CTR-SEO-001	마바05	IN_PROGRESS	LOW	f	\N	2026-03-05 06:06:24.607	2026-03-05 06:06:24.607	\N
6	SUBJ-2024-0006	CTR-SEO-001	바사06	MONITORING	HIGH	f	\N	2026-03-05 06:06:24.621	2026-03-05 06:06:24.621	\N
7	SUBJ-2024-0007	CTR-SEO-001	사아07	IN_PROGRESS	LOW	f	\N	2026-03-05 06:06:24.639	2026-03-05 06:06:24.639	\N
8	SUBJ-2024-0008	CTR-SEO-001	아자08	CLOSED	EMERG	f	\N	2026-03-05 06:06:24.651	2026-03-05 06:06:24.651	\N
9	SUBJ-2024-0009	CTR-GGI-001	자차09	IN_PROGRESS	HIGH	f	\N	2026-03-05 06:06:24.671	2026-03-05 06:06:24.671	\N
10	SUBJ-2024-0013	CTR-SEO-001	파하13	IN_PROGRESS	HIGH	f	\N	2026-03-05 06:06:24.687	2026-03-05 06:06:24.687	\N
11	SUBJ-2025-0001	CTR-SEO-001	다마16	IN_PROGRESS	MID	f	\N	2026-03-05 06:06:24.702	2026-03-05 06:06:24.702	\N
12	SUBJ-2025-0003	CTR-GGI-001	마사18	MONITORING	HIGH	f	\N	2026-03-05 06:06:24.715	2026-03-05 06:06:24.715	\N
\.


--
-- Data for Name: tb_case_closing; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_case_closing (closing_id, case_id, closing_type, closing_date, reason, outcome, is_deleted, created_at, created_by) FROM stdin;
1	8	GOAL_MET	2024-06-01 00:00:00	치료 목표 달성	단약 유지 6개월, 직업 복귀 완료	f	2026-03-05 06:06:24.665	\N
\.


--
-- Data for Name: tb_case_event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_case_event (event_id, case_id, event_type, title, note, event_at, created_by) FROM stdin;
1	1	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.548	\N
2	1	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.551	\N
3	1	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.552	\N
4	2	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.566	\N
5	2	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.568	\N
6	2	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.569	\N
7	3	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.579	\N
8	3	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.581	\N
9	3	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.582	\N
10	4	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.598	\N
11	4	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.599	\N
12	4	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.6	\N
13	5	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.609	\N
14	5	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.61	\N
15	5	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.612	\N
16	6	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.622	\N
17	6	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.623	\N
18	6	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.625	\N
19	7	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.64	\N
20	7	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.641	\N
21	7	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.643	\N
22	8	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.652	\N
23	8	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.654	\N
24	9	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.673	\N
25	9	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.674	\N
26	9	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.676	\N
27	10	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.689	\N
28	10	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.691	\N
29	10	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.693	\N
30	11	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.704	\N
31	11	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.705	\N
32	11	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.706	\N
33	12	INTAKE	접수 완료	초기 접수 및 긴급도 분류 완료	2026-03-05 06:06:24.716	\N
34	12	ASSESSMENT	초기 평가	DSM-5 기반 중독 심각도 평가 실시	2026-03-05 06:06:24.717	\N
35	12	ISP	ISP 수립	개인서비스계획 초안 작성 및 서명	2026-03-05 06:06:24.719	\N
\.


--
-- Data for Name: tb_case_monitoring; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_case_monitoring (monitor_id, case_id, monitor_at, method, condition, note, next_monitor, is_deleted, created_at, created_by) FROM stdin;
1	3	2026-01-19 06:06:24.588	VISIT	양호	단약 유지 중, 직업 훈련 참여	\N	f	2026-03-05 06:06:24.589	\N
2	3	2026-02-18 06:06:24.591	PHONE	양호	안정적 생활, 재발 위험 낮음	2026-04-04 06:06:24.591	f	2026-03-05 06:06:24.592	\N
3	6	2026-01-19 06:06:24.634	VISIT	양호	단약 유지 중, 직업 훈련 참여	\N	f	2026-03-05 06:06:24.635	\N
4	6	2026-02-18 06:06:24.635	PHONE	양호	안정적 생활, 재발 위험 낮음	2026-04-04 06:06:24.635	f	2026-03-05 06:06:24.636	\N
5	8	2026-01-19 06:06:24.66	VISIT	양호	단약 유지 중, 직업 훈련 참여	\N	f	2026-03-05 06:06:24.661	\N
6	8	2026-02-18 06:06:24.662	PHONE	양호	안정적 생활, 재발 위험 낮음	2026-04-04 06:06:24.662	f	2026-03-05 06:06:24.664	\N
7	12	2026-01-19 06:06:24.726	VISIT	양호	단약 유지 중, 직업 훈련 참여	\N	f	2026-03-05 06:06:24.728	\N
8	12	2026-02-18 06:06:24.728	PHONE	양호	안정적 생활, 재발 위험 낮음	2026-04-04 06:06:24.728	f	2026-03-05 06:06:24.729	\N
\.


--
-- Data for Name: tb_case_support; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_case_support (support_id, case_id, support_type, resource_id, referral_date, note, is_deleted, created_at) FROM stdin;
\.


--
-- Data for Name: tb_case_task; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_case_task (task_id, case_id, title, due_at, status, is_deleted, created_at) FROM stdin;
1	1	초기 평가 면담 예약	2026-03-12 06:06:24.552	DONE	f	2026-03-05 06:06:24.554
2	1	약물검사 결과 확인	2026-03-19 06:06:24.555	DOING	f	2026-03-05 06:06:24.557
3	2	초기 평가 면담 예약	2026-03-12 06:06:24.569	DONE	f	2026-03-05 06:06:24.57
4	2	약물검사 결과 확인	2026-03-19 06:06:24.57	DOING	f	2026-03-05 06:06:24.572
5	3	초기 평가 면담 예약	2026-03-12 06:06:24.582	DONE	f	2026-03-05 06:06:24.583
6	3	약물검사 결과 확인	2026-03-19 06:06:24.583	DOING	f	2026-03-05 06:06:24.584
7	4	초기 평가 면담 예약	2026-03-12 06:06:24.6	DONE	f	2026-03-05 06:06:24.601
8	4	약물검사 결과 확인	2026-03-19 06:06:24.601	DOING	f	2026-03-05 06:06:24.603
9	5	초기 평가 면담 예약	2026-03-12 06:06:24.613	DONE	f	2026-03-05 06:06:24.614
10	5	약물검사 결과 확인	2026-03-19 06:06:24.614	DOING	f	2026-03-05 06:06:24.615
11	6	초기 평가 면담 예약	2026-03-12 06:06:24.625	DONE	f	2026-03-05 06:06:24.626
12	6	약물검사 결과 확인	2026-03-19 06:06:24.627	DOING	f	2026-03-05 06:06:24.628
13	7	초기 평가 면담 예약	2026-03-12 06:06:24.643	DONE	f	2026-03-05 06:06:24.644
14	7	약물검사 결과 확인	2026-03-19 06:06:24.644	DOING	f	2026-03-05 06:06:24.646
15	8	초기 평가 면담 예약	2026-03-12 06:06:24.653	DONE	f	2026-03-05 06:06:24.655
16	8	약물검사 결과 확인	2026-03-19 06:06:24.655	DOING	f	2026-03-05 06:06:24.656
17	9	초기 평가 면담 예약	2026-03-12 06:06:24.676	DONE	f	2026-03-05 06:06:24.678
18	9	약물검사 결과 확인	2026-03-19 06:06:24.678	DOING	f	2026-03-05 06:06:24.68
19	10	초기 평가 면담 예약	2026-03-12 06:06:24.694	DONE	f	2026-03-05 06:06:24.695
20	10	약물검사 결과 확인	2026-03-19 06:06:24.695	DOING	f	2026-03-05 06:06:24.697
21	11	초기 평가 면담 예약	2026-03-12 06:06:24.706	DONE	f	2026-03-05 06:06:24.707
22	11	약물검사 결과 확인	2026-03-19 06:06:24.708	DOING	f	2026-03-05 06:06:24.709
23	12	초기 평가 면담 예약	2026-03-12 06:06:24.719	DONE	f	2026-03-05 06:06:24.72
24	12	약물검사 결과 확인	2026-03-19 06:06:24.721	DOING	f	2026-03-05 06:06:24.722
\.


--
-- Data for Name: tb_center; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_center (center_id, center_nm, region_cd, address, phone, manager, capacity, is_active, created_at, updated_at) FROM stdin;
CTR-SEO-001	서울중독재활센터	SEOUL	\N	\N	\N	50	t	2026-03-05 06:06:24.093	2026-03-05 06:06:24.093
CTR-BUS-001	부산중독재활센터	BUSAN	\N	\N	\N	30	t	2026-03-05 06:06:24.099	2026-03-05 06:06:24.099
CTR-GGI-001	경기중독재활센터	GYEONGGI	\N	\N	\N	40	t	2026-03-05 06:06:24.101	2026-03-05 06:06:24.101
CTR-ICN-001	인천중독재활센터	INCHEON	\N	\N	\N	25	t	2026-03-05 06:06:24.104	2026-03-05 06:06:24.104
CT-01	서울중독재활센터	SEOUL	서울시(예시 주소)	02-0000-0000	\N	30	t	2026-03-05 16:03:52.295	2026-03-05 16:03:52.295
CT-02	경기중독재활센터	GYEONGGI	경기도(예시 주소)	031-000-0000	\N	30	t	2026-03-05 16:03:52.295	2026-03-05 16:03:52.295
CT-03	부산중독재활센터	BUSAN	부산시(예시 주소)	051-000-0000	\N	30	t	2026-03-05 16:03:52.295	2026-03-05 16:03:52.295
\.


--
-- Data for Name: tb_closing_check_done; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_closing_check_done (done_id, closing_id, tpl_id, done_yn, done_at, done_by) FROM stdin;
\.


--
-- Data for Name: tb_closing_checklist_tpl; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_closing_checklist_tpl (tpl_id, closing_type, check_item, sort_order, is_active) FROM stdin;
1	MONTHLY	월간 통계 보고서 제출	1	t
2	MONTHLY	케이스 현황 업데이트 확인	2	t
3	QUARTERLY	분기 국가 통계 보고서 제출	1	t
4	ANNUAL	연간 실적 보고서 제출	1	t
5	MONTHLY	대상자 신규/종결 수 집계 확인	1	t
6	MONTHLY	사례 상태(진행/모니터링/종결) 검증	2	t
7	MONTHLY	상담 기록 누락 여부 점검	3	t
8	MONTHLY	연계(자원 의뢰) 진행/완료 상태 점검	4	t
9	MONTHLY	서식/첨부 파일 업로드 정상 여부 점검	5	t
10	QUARTERLY	분기 보고서 생성/검토	1	t
11	QUARTERLY	감사로그 샘플 점검	2	t
12	QUARTERLY	PII 접근 로그 점검	3	t
13	QUARTERLY	사례 성과 지표 산출	4	t
14	ANNUAL	연간 통계 보고서 확정	1	t
15	ANNUAL	개인정보 보유기간 초과 대상 검토	2	t
16	ANNUAL	시스템 접근권한 정기 재검토	3	t
\.


--
-- Data for Name: tb_closing_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_closing_history (closing_id, closing_type, period_label, center_id, status, closed_at, closed_by, created_at) FROM stdin;
\.


--
-- Data for Name: tb_code; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_code (group_cd, code, code_nm, code_nm_en, extra1, sort_order, is_active, created_at) FROM stdin;
DRUG_TYPE	METH	필로폰(메스암페타민)	\N	\N	0	t	2026-03-05 06:06:24.037
DRUG_TYPE	THC	대마	\N	\N	0	t	2026-03-05 06:06:24.048
DRUG_TYPE	COCAINE	코카인	\N	\N	0	t	2026-03-05 06:06:24.051
DRUG_TYPE	HEROIN	헤로인	\N	\N	0	t	2026-03-05 06:06:24.054
DRUG_TYPE	MDMA	MDMA(엑스터시)	\N	\N	0	t	2026-03-05 06:06:24.057
DRUG_TYPE	FENTANYL	펜타닐	\N	\N	0	t	2026-03-05 06:06:24.06
DRUG_TYPE	OTHER	기타	\N	\N	0	t	2026-03-05 06:06:24.063
GENDER	M	남	Male	\N	1	t	2026-03-05 16:03:52.295
GENDER	F	여	Female	\N	2	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	1342	1342 콜센터	Call Center 1342	\N	1	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	SELF	자진	Self	\N	2	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	AGENCY	기관 연계	Agency	\N	3	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	LEGAL	사법/법원/검찰	Legal	\N	4	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	ONLINE	온라인	Online	\N	5	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	WALKIN	내방	Walk-in	\N	6	t	2026-03-05 16:03:52.295
DRUG_TYPE	PHILOPON	필로폰	Methamphetamine	\N	1	t	2026-03-05 16:03:52.295
DRUG_TYPE	CANNABIS	대마	Cannabis	\N	2	t	2026-03-05 16:03:52.295
DRUG_TYPE	HYPNOTIC	향정	Psychotropics	\N	3	t	2026-03-05 16:03:52.295
DRUG_TYPE	OPIATE	마약	Narcotics	\N	4	t	2026-03-05 16:03:52.295
DRUG_TYPE	ETC	기타	Others	\N	99	t	2026-03-05 16:03:52.295
TRIAGE	LOW	낮음	Low	\N	1	t	2026-03-05 16:03:52.295
TRIAGE	MID	중간	Medium	\N	2	t	2026-03-05 16:03:52.295
TRIAGE	HIGH	높음	High	\N	3	t	2026-03-05 16:03:52.295
TRIAGE	EMERG	응급	Emergency	\N	4	t	2026-03-05 16:03:52.295
INTAKE_STATUS	QUEUE	대기	Queue	\N	1	t	2026-03-05 16:03:52.295
INTAKE_STATUS	SCREEN	스크리닝	Screening	\N	2	t	2026-03-05 16:03:52.295
INTAKE_STATUS	CONSENT	동의	Consent	\N	3	t	2026-03-05 16:03:52.295
INTAKE_STATUS	ASSIGN	배정	Assign	\N	4	t	2026-03-05 16:03:52.295
INTAKE_STATUS	DONE	완료	Done	\N	5	t	2026-03-05 16:03:52.295
CASE_STATUS	NEW	신규	New	\N	1	t	2026-03-05 16:03:52.295
CASE_STATUS	IN_PROGRESS	진행	In Progress	\N	2	t	2026-03-05 16:03:52.295
CASE_STATUS	MONITORING	모니터링	Monitoring	\N	3	t	2026-03-05 16:03:52.295
CASE_STATUS	CLOSED	종결	Closed	\N	4	t	2026-03-05 16:03:52.295
TASK_STATUS	TODO	예정	To Do	\N	1	t	2026-03-05 16:03:52.295
TASK_STATUS	DOING	진행중	Doing	\N	2	t	2026-03-05 16:03:52.295
TASK_STATUS	DONE	완료	Done	\N	3	t	2026-03-05 16:03:52.295
COUNSEL_TYPE	VISIT	내방	Visit	\N	1	t	2026-03-05 16:03:52.295
COUNSEL_TYPE	CALL	전화	Call	\N	2	t	2026-03-05 16:03:52.295
COUNSEL_TYPE	HOME	가정방문	Home Visit	\N	3	t	2026-03-05 16:03:52.295
COUNSEL_TYPE	GROUP	집단	Group	\N	4	t	2026-03-05 16:03:52.295
COUNSEL_TYPE	ETC	기타	Others	\N	99	t	2026-03-05 16:03:52.295
CONTACT_METHOD	VISIT	방문	Visit	\N	1	t	2026-03-05 16:03:52.295
CONTACT_METHOD	CALL	전화	Call	\N	2	t	2026-03-05 16:03:52.295
CONTACT_METHOD	MESSAGE	문자/메신저	Message	\N	3	t	2026-03-05 16:03:52.295
CONTACT_METHOD	OTHER	기타	Other	\N	99	t	2026-03-05 16:03:52.295
CONTACT_RESULT	STABLE	안정	Stable	\N	1	t	2026-03-05 16:03:52.295
CONTACT_RESULT	ALERT	주의	Alert	\N	2	t	2026-03-05 16:03:52.295
CONTACT_RESULT	CRISIS	위기	Crisis	\N	3	t	2026-03-05 16:03:52.295
CONTACT_RESULT	NO_CONTACT	미연락	No Contact	\N	4	t	2026-03-05 16:03:52.295
REFERRAL_STATUS	OPEN	접수	Open	\N	1	t	2026-03-05 16:03:52.295
REFERRAL_STATUS	IN_PROGRESS	진행	In Progress	\N	2	t	2026-03-05 16:03:52.295
REFERRAL_STATUS	DONE	완료	Done	\N	3	t	2026-03-05 16:03:52.295
REFERRAL_STATUS	FAIL	실패	Fail	\N	4	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	MEDICAL	의료	Medical	\N	1	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	WELFARE	복지	Welfare	\N	2	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	LEGAL	법률	Legal	\N	3	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	EMPLOYMENT	취업	Employment	\N	4	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	SELF_HELP	자조모임	Self-help	\N	5	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	ETC	기타	Others	\N	99	t	2026-03-05 16:03:52.295
CLOSING_REASON	RECOVERY	회복	Recovery	\N	1	t	2026-03-05 16:03:52.295
CLOSING_REASON	REFERRAL	타기관연계	Referral	\N	2	t	2026-03-05 16:03:52.295
CLOSING_REASON	DROPOUT	중도탈락	Dropout	\N	3	t	2026-03-05 16:03:52.295
CLOSING_REASON	DEATH	사망	Death	\N	4	t	2026-03-05 16:03:52.295
CLOSING_REASON	OTHER	기타	Other	\N	99	t	2026-03-05 16:03:52.295
\.


--
-- Data for Name: tb_code_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_code_group (group_cd, group_nm, description, sort_order, is_active, created_at) FROM stdin;
GENDER	성별	M/F 등 성별 코드	10	t	2026-03-05 16:03:52.295
ENTRY_ROUTE	유입경로	1342/자진/기관연계/사법 등	20	t	2026-03-05 16:03:52.295
DRUG_TYPE	마약 유형	필로폰/대마/향정/마약 등	30	t	2026-03-05 06:06:24.005
TRIAGE	긴급도	LOW/MID/HIGH/EMERG	40	t	2026-03-05 16:03:52.295
INTAKE_STATUS	접수 상태	QUEUE/SCREEN/CONSENT/ASSIGN/DONE	50	t	2026-03-05 16:03:52.295
CASE_STATUS	사례 상태	NEW/IN_PROGRESS/MONITORING/CLOSED	60	t	2026-03-05 16:03:52.295
TASK_STATUS	업무 상태	TODO/DOING/DONE	70	t	2026-03-05 16:03:52.295
COUNSEL_TYPE	상담 유형	내방/전화/가정방문/집단 등	80	t	2026-03-05 16:03:52.295
CONTACT_METHOD	접촉 방식	VISIT/CALL/MESSAGE/OTHER	90	t	2026-03-05 16:03:52.295
CONTACT_RESULT	접촉 결과	STABLE/ALERT/CRISIS/NO_CONTACT	100	t	2026-03-05 16:03:52.295
REFERRAL_STATUS	연계 상태	OPEN/IN_PROGRESS/DONE/FAIL	110	t	2026-03-05 16:03:52.295
RESOURCE_TYPE	자원 유형	MEDICAL/WELFARE/LEGAL/EMPLOYMENT...	120	t	2026-03-05 16:03:52.295
CLOSING_REASON	종결 사유	RECOVERY/REFERRAL/DROPOUT/DEATH/OTHER	130	t	2026-03-05 16:03:52.295
\.


--
-- Data for Name: tb_connector; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_connector (connector_id, connector_nm, group_cd, endpoint_url, status, last_sync_at, is_active, created_at) FROM stdin;
C-EA-1342	MHIS 1342	EA	\N	OK	\N	t	2026-03-05 06:06:24.119
C-EA-HEALTH	정신건강 통합	EA	\N	OK	\N	t	2026-03-05 06:06:24.124
C-ADMIN-COURT	법원 전산망	ADMIN	\N	DEGRADED	\N	t	2026-03-05 06:06:24.128
C-ADMIN-POLICE	경찰청 기소유예	ADMIN	\N	OK	\N	t	2026-03-05 06:06:24.131
C-ADMIN-WELFARE	행복e음	ADMIN	\N	OK	\N	t	2026-03-05 06:06:24.134
CONN-SMS	SMS 발송 게이트웨이	EA	https://sms.example.local	OK	\N	t	2026-03-05 16:03:52.295
CONN-1342-API	1342 콜센터 연계(샘플)	ADMIN	https://1342.example.local	OK	\N	t	2026-03-05 16:03:52.295
CONN-HEALTH	보건소 연계	ADMIN	https://health.example.local	OK	\N	t	2026-03-05 16:03:52.295
\.


--
-- Data for Name: tb_counseling; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_counseling (counsel_id, case_id, counsel_at, duration, method, summary, is_deleted, created_at, created_by) FROM stdin;
1	1	2026-01-04 06:06:24.557	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.558	\N
2	1	2026-02-03 06:06:24.56	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.562	\N
3	2	2026-01-04 06:06:24.572	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.573	\N
4	2	2026-02-03 06:06:24.573	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.574	\N
5	3	2026-01-04 06:06:24.584	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.585	\N
6	3	2026-02-03 06:06:24.585	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.587	\N
7	3	2026-02-23 06:06:24.586	30	PHONE	전화 상담 — 단약 유지 확인, 위기 없음	f	2026-03-05 06:06:24.588	\N
8	4	2026-01-04 06:06:24.602	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.604	\N
9	4	2026-02-03 06:06:24.604	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.605	\N
10	5	2026-01-04 06:06:24.615	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.617	\N
11	5	2026-02-03 06:06:24.617	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.618	\N
12	6	2026-01-04 06:06:24.629	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.63	\N
13	6	2026-02-03 06:06:24.63	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.632	\N
14	6	2026-02-23 06:06:24.632	30	PHONE	전화 상담 — 단약 유지 확인, 위기 없음	f	2026-03-05 06:06:24.634	\N
15	7	2026-01-04 06:06:24.646	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.647	\N
16	7	2026-02-03 06:06:24.647	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.649	\N
17	8	2026-01-04 06:06:24.656	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.657	\N
18	8	2026-02-03 06:06:24.658	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.659	\N
19	9	2026-01-04 06:06:24.68	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.682	\N
20	9	2026-02-03 06:06:24.682	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.684	\N
21	10	2026-01-04 06:06:24.697	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.699	\N
22	10	2026-02-03 06:06:24.699	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.7	\N
23	11	2026-01-04 06:06:24.709	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.71	\N
24	11	2026-02-03 06:06:24.71	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.712	\N
25	12	2026-01-04 06:06:24.722	50	FACE	초기 면담 — 동기 탐색 및 치료 목표 설정	f	2026-03-05 06:06:24.723	\N
26	12	2026-02-03 06:06:24.723	50	FACE	2차 면담 — 단약 의지 강화, 촉발요인 분석	f	2026-03-05 06:06:24.725	\N
27	12	2026-02-23 06:06:24.725	30	PHONE	전화 상담 — 단약 유지 확인, 위기 없음	f	2026-03-05 06:06:24.726	\N
\.


--
-- Data for Name: tb_edu_legal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_edu_legal (edu_id, subject_id, legal_type, court_nm, order_date, start_date, end_date, hours, status, is_deleted, created_at) FROM stdin;
1	SUBJ-2024-0001	PROSECUTION_SUSPENDED	서울중앙지방법원	2024-01-05 00:00:00	2024-02-01 00:00:00	2024-07-31 00:00:00	40	COMPLETED	f	2026-03-05 06:06:24.822
2	SUBJ-2024-0003	TRAINING	수원지방법원	2024-01-30 00:00:00	2024-02-15 00:00:00	2024-08-14 00:00:00	60	IN_PROGRESS	f	2026-03-05 06:06:24.832
3	SUBJ-2024-0006	PROSECUTION_SUSPENDED	대구지방법원	2024-03-01 00:00:00	2024-04-01 00:00:00	2024-09-30 00:00:00	40	IN_PROGRESS	f	2026-03-05 06:06:24.835
4	SUBJ-2024-0008	COMPLETION	대전지방법원	2023-08-25 00:00:00	2023-09-10 00:00:00	2024-03-09 00:00:00	80	COMPLETED	f	2026-03-05 06:06:24.837
5	SUBJ-2024-0011	TRAINING	부산지방법원	2024-04-15 00:00:00	2024-05-06 00:00:00	2024-11-04 00:00:00	60	IN_PROGRESS	f	2026-03-05 06:06:24.845
6	SUBJ-2024-0015	PROSECUTION_SUSPENDED	울산지방법원	2023-05-20 00:00:00	2023-06-05 00:00:00	2023-12-04 00:00:00	40	COMPLETED	f	2026-03-05 06:06:24.848
7	SUBJ-2025-0003	TRAINING	안산지원	2025-02-01 00:00:00	2025-03-01 00:00:00	2025-08-31 00:00:00	60	SCHEDULED	f	2026-03-05 06:06:24.855
\.


--
-- Data for Name: tb_edu_legal_attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_edu_legal_attendance (attend_id, edu_id, attend_date, hours, note) FROM stdin;
1	1	2024-02-01 00:00:00	13	\N
2	1	2024-02-15 00:00:00	13	\N
3	1	2024-02-29 00:00:00	13	\N
4	4	2023-09-10 00:00:00	26	\N
5	4	2023-09-24 00:00:00	26	\N
6	4	2023-10-08 00:00:00	26	\N
7	6	2023-06-05 00:00:00	13	\N
8	6	2023-06-19 00:00:00	13	\N
9	6	2023-07-03 00:00:00	13	\N
\.


--
-- Data for Name: tb_edu_outreach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_edu_outreach (outreach_id, outreach_date, location, staff_count, target_count, note, is_deleted, created_at, created_by) FROM stdin;
1	2024-02-20 00:00:00	서울 강남구 청소년 수련관	3	45	청소년 마약 예방 교육	f	2026-03-05 06:06:24.859	\N
2	2024-04-15 00:00:00	부산 해운대구 주민센터	2	30	지역사회 중독 예방 캠페인	f	2026-03-05 06:06:24.863	\N
3	2024-06-10 00:00:00	경기 수원 고등학교	4	120	학교 방문 마약 예방 교육	f	2026-03-05 06:06:24.865	\N
4	2024-09-05 00:00:00	인천 남동구 산업단지	2	50	직장인 대상 예방 교육	f	2026-03-05 06:06:24.867	\N
5	2025-01-20 00:00:00	서울 노원구 복지관	3	35	취약계층 중독 예방 교육	f	2026-03-05 06:06:24.869	\N
6	2025-02-18 00:00:00	대구 달서구 청소년 센터	2	60	청소년 마약 예방 교육	f	2026-03-05 06:06:24.871	\N
\.


--
-- Data for Name: tb_edu_program; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_edu_program (program_id, program_nm, program_type, center_id, capacity, is_active, is_deleted, created_at) FROM stdin;
\.


--
-- Data for Name: tb_edu_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_edu_session (session_id, program_id, session_date, instructor, location, note) FROM stdin;
\.


--
-- Data for Name: tb_edu_session_attend; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_edu_session_attend (attend_id, session_id, subject_id, attended, note) FROM stdin;
\.


--
-- Data for Name: tb_family; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_family (family_id, subject_id, relation, phone_enc, is_living, consent_yn, is_deleted, created_at) FROM stdin;
\.


--
-- Data for Name: tb_faq; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_faq (faq_id, question, answer, category, sort_order, is_active, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: tb_form_template; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_form_template (form_id, form_nm, file_ext, file_path, version, is_active, is_deleted, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: tb_intake; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_intake (intake_id, intake_no, source, region_cd, triage, consent, summary, preferred_center, assigned_center, intake_step, subject_id, converted_case_id, is_deleted, created_at, updated_at, created_by) FROM stdin;
1	IN-2024-0001	1342	SEOUL	HIGH	t	1342 신고 → 긴급 중재, 동의 후 사례 전환	CTR-SEO-001	CTR-SEO-001	CONVERT	SUBJ-2024-0001	\N	f	2026-03-05 06:06:24.429	2026-03-05 06:06:24.429	\N
2	IN-2024-0002	WALKIN	BUSAN	MID	t	센터 직접 방문	CTR-BUS-001	CTR-BUS-001	CONVERT	SUBJ-2024-0002	\N	f	2026-03-05 06:06:24.443	2026-03-05 06:06:24.443	\N
3	IN-2024-0003	AGENCY	GYEONGGI	HIGH	t	법원 연계 의뢰	CTR-GGI-001	CTR-GGI-001	CONVERT	SUBJ-2024-0003	\N	f	2026-03-05 06:06:24.452	2026-03-05 06:06:24.452	\N
4	IN-2024-0004	ONLINE	INCHEON	MID	t	온라인 상담 신청	CTR-ICN-001	CTR-ICN-001	CONVERT	SUBJ-2024-0004	\N	f	2026-03-05 06:06:24.462	2026-03-05 06:06:24.462	\N
5	IN-2024-0005	1342	SEOUL	LOW	t	1342 자의 연락	CTR-SEO-001	CTR-SEO-001	CONVERT	SUBJ-2024-0005	\N	f	2026-03-05 06:06:24.472	2026-03-05 06:06:24.472	\N
6	IN-2024-0006	AGENCY	DAEGU	HIGH	t	검찰청 연계	\N	\N	CONVERT	SUBJ-2024-0006	\N	f	2026-03-05 06:06:24.482	2026-03-05 06:06:24.482	\N
7	IN-2024-0007	WALKIN	GWANGJU	LOW	t	직접 방문 상담 신청	\N	\N	CONVERT	SUBJ-2024-0007	\N	f	2026-03-05 06:06:24.491	2026-03-05 06:06:24.491	\N
8	IN-2024-0008	AGENCY	DAEJEON	EMERG	t	과다복용 응급 연계	\N	\N	CONVERT	SUBJ-2024-0008	\N	f	2026-03-05 06:06:24.501	2026-03-05 06:06:24.501	\N
9	IN-2024-0009	1342	GYEONGGI	HIGH	t	복합물질 의존 신고	CTR-GGI-001	CTR-GGI-001	CONVERT	SUBJ-2024-0009	\N	f	2026-03-05 06:06:24.51	2026-03-05 06:06:24.51	\N
10	IN-2024-0010	ONLINE	SEOUL	LOW	f	익명 온라인 상담 접수 → 동의 미획득 대기	\N	\N	SCREEN	\N	\N	f	2026-03-05 06:06:24.519	2026-03-05 06:06:24.519	\N
11	IN-2025-0001	1342	SEOUL	MID	t	신규 접수	CTR-SEO-001	CTR-SEO-001	CONVERT	SUBJ-2025-0001	\N	f	2026-03-05 06:06:24.524	2026-03-05 06:06:24.524	\N
12	IN-2025-0002	WALKIN	BUSAN	LOW	t	센터 방문 자의 접수	CTR-BUS-001	CTR-BUS-001	CONVERT	SUBJ-2025-0002	\N	f	2026-03-05 06:06:24.534	2026-03-05 06:06:24.534	\N
\.


--
-- Data for Name: tb_intake_step_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_intake_step_log (log_id, intake_id, step, done_at, done_by, note) FROM stdin;
1	1	QUEUE	2026-03-05 06:06:24.433	시스템	\N
2	1	SCREEN	2026-03-05 06:06:24.436	시스템	\N
3	1	CONSENT	2026-03-05 06:06:24.437	시스템	\N
4	1	ASSIGN	2026-03-05 06:06:24.438	시스템	\N
5	1	CONVERT	2026-03-05 06:06:24.44	시스템	\N
6	2	QUEUE	2026-03-05 06:06:24.444	시스템	\N
7	2	SCREEN	2026-03-05 06:06:24.446	시스템	\N
8	2	CONSENT	2026-03-05 06:06:24.448	시스템	\N
9	2	ASSIGN	2026-03-05 06:06:24.449	시스템	\N
10	2	CONVERT	2026-03-05 06:06:24.45	시스템	\N
11	3	QUEUE	2026-03-05 06:06:24.454	시스템	\N
12	3	SCREEN	2026-03-05 06:06:24.455	시스템	\N
13	3	CONSENT	2026-03-05 06:06:24.457	시스템	\N
14	3	ASSIGN	2026-03-05 06:06:24.458	시스템	\N
15	3	CONVERT	2026-03-05 06:06:24.46	시스템	\N
16	4	QUEUE	2026-03-05 06:06:24.464	시스템	\N
17	4	SCREEN	2026-03-05 06:06:24.466	시스템	\N
18	4	CONSENT	2026-03-05 06:06:24.467	시스템	\N
19	4	ASSIGN	2026-03-05 06:06:24.468	시스템	\N
20	4	CONVERT	2026-03-05 06:06:24.469	시스템	\N
21	5	QUEUE	2026-03-05 06:06:24.474	시스템	\N
22	5	SCREEN	2026-03-05 06:06:24.475	시스템	\N
23	5	CONSENT	2026-03-05 06:06:24.476	시스템	\N
24	5	ASSIGN	2026-03-05 06:06:24.478	시스템	\N
25	5	CONVERT	2026-03-05 06:06:24.479	시스템	\N
26	6	QUEUE	2026-03-05 06:06:24.484	시스템	\N
27	6	SCREEN	2026-03-05 06:06:24.485	시스템	\N
28	6	CONSENT	2026-03-05 06:06:24.486	시스템	\N
29	6	ASSIGN	2026-03-05 06:06:24.488	시스템	\N
30	6	CONVERT	2026-03-05 06:06:24.489	시스템	\N
31	7	QUEUE	2026-03-05 06:06:24.493	시스템	\N
32	7	SCREEN	2026-03-05 06:06:24.494	시스템	\N
33	7	CONSENT	2026-03-05 06:06:24.495	시스템	\N
34	7	ASSIGN	2026-03-05 06:06:24.497	시스템	\N
35	7	CONVERT	2026-03-05 06:06:24.498	시스템	\N
36	8	QUEUE	2026-03-05 06:06:24.503	시스템	\N
37	8	SCREEN	2026-03-05 06:06:24.504	시스템	\N
38	8	CONSENT	2026-03-05 06:06:24.505	시스템	\N
39	8	ASSIGN	2026-03-05 06:06:24.506	시스템	\N
40	8	CONVERT	2026-03-05 06:06:24.507	시스템	\N
41	9	QUEUE	2026-03-05 06:06:24.511	시스템	\N
42	9	SCREEN	2026-03-05 06:06:24.513	시스템	\N
43	9	CONSENT	2026-03-05 06:06:24.514	시스템	\N
44	9	ASSIGN	2026-03-05 06:06:24.516	시스템	\N
45	9	CONVERT	2026-03-05 06:06:24.517	시스템	\N
46	10	QUEUE	2026-03-05 06:06:24.521	시스템	\N
47	10	SCREEN	2026-03-05 06:06:24.522	시스템	\N
48	11	QUEUE	2026-03-05 06:06:24.526	시스템	\N
49	11	SCREEN	2026-03-05 06:06:24.527	시스템	\N
50	11	CONSENT	2026-03-05 06:06:24.529	시스템	\N
51	11	ASSIGN	2026-03-05 06:06:24.531	시스템	\N
52	11	CONVERT	2026-03-05 06:06:24.532	시스템	\N
53	12	QUEUE	2026-03-05 06:06:24.536	시스템	\N
54	12	SCREEN	2026-03-05 06:06:24.537	시스템	\N
55	12	CONSENT	2026-03-05 06:06:24.538	시스템	\N
56	12	ASSIGN	2026-03-05 06:06:24.54	시스템	\N
57	12	CONVERT	2026-03-05 06:06:24.541	시스템	\N
\.


--
-- Data for Name: tb_integration_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_integration_log (log_id, connector_id, direction, message, payload, result, error_msg, retry_count, retried_from, logged_at) FROM stdin;
\.


--
-- Data for Name: tb_isp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_isp (isp_id, case_id, version, is_current, review_cycle, crisis_plan, is_deleted, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: tb_isp_goal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_isp_goal (goal_id, isp_id, horizon, goal, metric, due, status) FROM stdin;
\.


--
-- Data for Name: tb_isp_intervention; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_isp_intervention (intervention_id, isp_id, category, action, owner, schedule) FROM stdin;
\.


--
-- Data for Name: tb_isp_problem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_isp_problem (problem_id, isp_id, sort_order, problem) FROM stdin;
\.


--
-- Data for Name: tb_member_basic; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_basic (member_reg_dt, member_reg_seq, org_rsrc_cd, member_type_cd, guardian_priority, guardian_rel_cd, guardian_cohabit_yn, guardian_support_cd, nationality_cd, member_nm, rrn, birth_dt, age, gender_cd, suicide_prev_yn, local_office_no, zip_cd, addr1, addr2, addr_major_cd, addr_minor_cd, phone1, phone2, phone3, ext_phone1, ext_phone2, ext_phone3, edu_cd, job_cd, grade_cd, econ_cd, religion_cd, family_type_cd, ref_major_cd, ref_minor_cd, ref_sub_cd, mental_dis_grade_cd, mental_dis_yn, other_dis_content, family_content, reg_major_cd, diag_cd, counsel_dt, counsel_seq, pii_mod_dt, pii_mod_id, mgmt_dt, remark, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_member_diagnosis; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_diagnosis (member_reg_dt, member_reg_seq, input_dt, diag_cd, diag_nm, diag_priority, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_member_eval_basic; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_eval_basic (member_reg_dt, member_reg_seq, biz_type_cd, eval_dt, eval_tool_cd, eval_score, eval_summary, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_member_eval_detail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_eval_detail (member_reg_dt, member_reg_seq, biz_type_cd, eval_dt, eval_tool_cd, eval_tool_det_cd, eval_score, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_member_isp_assess_basic; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_isp_assess_basic (member_reg_dt, member_reg_seq, assess_seq, assess_dt, biz_type_cd, pii_mod_dt, pii_mod_id, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_member_linkage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_linkage (link_dt, link_seq, member_reg_dt, member_reg_seq, link_org_rsrc_cd, link_svc_cd, link_content, link_result_cd, link_end_dt, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_member_medication; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_member_medication (member_reg_dt, member_reg_seq, input_dt, input_seq, prescribing_nm, drug_nm_cd, dosage_mgmt_cd, compliance_cd, side_effect_yn, reg_org_cd, reg_dt, reg_id, upd_org_cd, upd_dt, upd_id) FROM stdin;
\.


--
-- Data for Name: tb_notice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_notice (notice_id, title, content, is_important, center_id, notice_date, expire_date, is_deleted, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: tb_region; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_region (region_cd, region_nm, sort_order) FROM stdin;
SEOUL	서울	1
GYEONGGI	경기	2
INCHEON	인천	3
BUSAN	부산	4
DAEGU	대구	5
GWANGJU	광주	6
DAEJEON	대전	7
ULSAN	울산	8
SEJONG	세종	9
GANGWON	강원	10
CHUNGBUK	충북	11
CHUNGNAM	충남	12
JEONBUK	전북	13
JEONNAM	전남	14
GYEONGBUK	경북	15
GYEONGNAM	경남	16
JEJU	제주	17
\.


--
-- Data for Name: tb_report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_report (report_id, report_type, report_title, period_from, period_to, center_id, file_path, status, submitted_at, approved_by, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: tb_resource; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_resource (resource_id, resource_nm, resource_type, region_cd, phone, address, note, is_active, is_deleted, created_at) FROM stdin;
\.


--
-- Data for Name: tb_resource_referral; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_resource_referral (referral_id, resource_id, case_id, referral_date, purpose, result, is_deleted, created_at) FROM stdin;
\.


--
-- Data for Name: tb_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_role (role_id, role_nm) FROM stdin;
ADMIN	관리자
MANAGER	팀장
COUNSELOR	상담사
VIEWER	열람자
\.


--
-- Data for Name: tb_stats_monthly; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_stats_monthly (stats_id, yyyymm, center_id, region_cd, intake_total, intake_1342, intake_legal, intake_agency, intake_self, case_new, case_in_progress, case_monitoring, case_closed, edu_legal_cnt, edu_short_cnt, edu_outreach_cnt, counsel_cnt, generated_at) FROM stdin;
\.


--
-- Data for Name: tb_subject; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_subject (subject_id, case_no, alias, gender, birth_year, region_cd, entry_route, status, is_deleted, deleted_at, registered_at, created_at, updated_at, created_by) FROM stdin;
SUBJ-2024-0001	SUBJ-2024-0001	가나01	M	1985	SEOUL	1342	ACTIVE	f	\N	2024-01-10 00:00:00	2026-03-05 06:06:24.16	2026-03-05 06:06:24.16	\N
SUBJ-2024-0002	SUBJ-2024-0002	나다02	F	1992	BUSAN	SELF	ACTIVE	f	\N	2024-01-20 00:00:00	2026-03-05 06:06:24.191	2026-03-05 06:06:24.191	\N
SUBJ-2024-0003	SUBJ-2024-0003	다라03	M	1978	GYEONGGI	LEGAL	MONITORING	f	\N	2024-02-05 00:00:00	2026-03-05 06:06:24.205	2026-03-05 06:06:24.205	\N
SUBJ-2024-0004	SUBJ-2024-0004	라마04	M	1990	INCHEON	AGENCY	ACTIVE	f	\N	2024-02-15 00:00:00	2026-03-05 06:06:24.219	2026-03-05 06:06:24.219	\N
SUBJ-2024-0005	SUBJ-2024-0005	마바05	F	2000	SEOUL	1342	ACTIVE	f	\N	2024-03-01 00:00:00	2026-03-05 06:06:24.232	2026-03-05 06:06:24.232	\N
SUBJ-2024-0006	SUBJ-2024-0006	바사06	M	1975	DAEGU	LEGAL	MONITORING	f	\N	2024-03-10 00:00:00	2026-03-05 06:06:24.244	2026-03-05 06:06:24.244	\N
SUBJ-2024-0007	SUBJ-2024-0007	사아07	F	1988	GWANGJU	SELF	ACTIVE	f	\N	2024-03-20 00:00:00	2026-03-05 06:06:24.255	2026-03-05 06:06:24.255	\N
SUBJ-2024-0008	SUBJ-2024-0008	아자08	M	1983	DAEJEON	AGENCY	CLOSED	f	\N	2023-09-01 00:00:00	2026-03-05 06:06:24.264	2026-03-05 06:06:24.264	\N
SUBJ-2024-0009	SUBJ-2024-0009	자차09	M	1995	GYEONGGI	1342	ACTIVE	f	\N	2024-04-05 00:00:00	2026-03-05 06:06:24.278	2026-03-05 06:06:24.278	\N
SUBJ-2024-0010	SUBJ-2024-0010	차카10	F	1997	SEOUL	SELF	ACTIVE	f	\N	2024-04-15 00:00:00	2026-03-05 06:06:24.292	2026-03-05 06:06:24.292	\N
SUBJ-2024-0011	SUBJ-2024-0011	카타11	M	1980	BUSAN	LEGAL	MONITORING	f	\N	2024-04-20 00:00:00	2026-03-05 06:06:24.303	2026-03-05 06:06:24.303	\N
SUBJ-2024-0012	SUBJ-2024-0012	타파12	F	1993	INCHEON	1342	ACTIVE	f	\N	2024-05-03 00:00:00	2026-03-05 06:06:24.318	2026-03-05 06:06:24.318	\N
SUBJ-2024-0013	SUBJ-2024-0013	파하13	M	1987	SEOUL	AGENCY	ACTIVE	f	\N	2024-05-15 00:00:00	2026-03-05 06:06:24.329	2026-03-05 06:06:24.329	\N
SUBJ-2024-0014	SUBJ-2024-0014	하가14	F	2002	GYEONGGI	SELF	ACTIVE	f	\N	2024-06-01 00:00:00	2026-03-05 06:06:24.346	2026-03-05 06:06:24.346	\N
SUBJ-2024-0015	SUBJ-2024-0015	나라15	M	1972	ULSAN	LEGAL	CLOSED	f	\N	2023-06-01 00:00:00	2026-03-05 06:06:24.356	2026-03-05 06:06:24.356	\N
SUBJ-2025-0001	SUBJ-2025-0001	다마16	M	1991	SEOUL	1342	ACTIVE	f	\N	2025-01-08 00:00:00	2026-03-05 06:06:24.374	2026-03-05 06:06:24.374	\N
SUBJ-2025-0002	SUBJ-2025-0002	라바17	F	1998	BUSAN	SELF	ACTIVE	f	\N	2025-01-20 00:00:00	2026-03-05 06:06:24.385	2026-03-05 06:06:24.385	\N
SUBJ-2025-0003	SUBJ-2025-0003	마사18	M	1986	GYEONGGI	LEGAL	MONITORING	f	\N	2025-02-10 00:00:00	2026-03-05 06:06:24.397	2026-03-05 06:06:24.397	\N
SUBJ-2025-0004	SUBJ-2025-0004	바아19	F	1994	DAEGU	AGENCY	ACTIVE	f	\N	2025-02-25 00:00:00	2026-03-05 06:06:24.408	2026-03-05 06:06:24.408	\N
SUBJ-2025-0005	SUBJ-2025-0005	사자20	M	1982	JEONBUK	1342	ACTIVE	f	\N	2025-03-01 00:00:00	2026-03-05 06:06:24.417	2026-03-05 06:06:24.417	\N
\.


--
-- Data for Name: tb_subject_drug; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_subject_drug (id, subject_id, drug_cd, is_primary) FROM stdin;
1	SUBJ-2024-0001	METH	t
2	SUBJ-2024-0002	THC	t
3	SUBJ-2024-0002	MDMA	f
4	SUBJ-2024-0003	HEROIN	t
5	SUBJ-2024-0004	COCAINE	t
6	SUBJ-2024-0005	MDMA	t
7	SUBJ-2024-0005	THC	f
8	SUBJ-2024-0006	METH	t
9	SUBJ-2024-0007	THC	t
10	SUBJ-2024-0008	FENTANYL	t
11	SUBJ-2024-0009	METH	t
12	SUBJ-2024-0009	HEROIN	f
13	SUBJ-2024-0010	COCAINE	t
14	SUBJ-2024-0011	METH	t
15	SUBJ-2024-0012	MDMA	t
16	SUBJ-2024-0013	HEROIN	t
17	SUBJ-2024-0013	FENTANYL	f
18	SUBJ-2024-0014	THC	t
19	SUBJ-2024-0015	METH	t
20	SUBJ-2025-0001	METH	t
21	SUBJ-2025-0002	COCAINE	t
22	SUBJ-2025-0002	MDMA	f
23	SUBJ-2025-0003	METH	t
24	SUBJ-2025-0003	COCAINE	f
25	SUBJ-2025-0004	THC	t
26	SUBJ-2025-0005	FENTANYL	t
\.


--
-- Data for Name: tb_subject_pii; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_subject_pii (subject_id, full_name_enc, rrn_enc, phone_enc, addr_enc, updated_at) FROM stdin;
SUBJ-2024-0001	enc:홍길동	enc:850101-1234567	enc:010-1234-0001	enc:서울시 강남구	2026-03-05 06:06:24.167
SUBJ-2024-0002	enc:김지수	enc:920505-2345678	enc:010-2345-0002	enc:부산시 해운대구	2026-03-05 06:06:24.197
SUBJ-2024-0003	enc:이민수	enc:780315-1456789	enc:010-3456-0003	enc:경기도 수원시	2026-03-05 06:06:24.208
SUBJ-2024-0004	enc:박준영	enc:900720-1567890	enc:010-4567-0004	enc:인천시 남동구	2026-03-05 06:06:24.223
SUBJ-2024-0005	enc:정수연	enc:000312-2678901	enc:010-5678-0005	enc:서울시 마포구	2026-03-05 06:06:24.236
SUBJ-2024-0006	enc:최동현	enc:750828-1789012	enc:010-6789-0006	enc:대구시 달서구	2026-03-05 06:06:24.248
SUBJ-2024-0007	enc:강유진	enc:880430-2890123	enc:010-7890-0007	enc:광주시 북구	2026-03-05 06:06:24.258
SUBJ-2024-0008	enc:윤재혁	enc:830615-1901234	enc:010-8901-0008	enc:대전시 서구	2026-03-05 06:06:24.267
SUBJ-2024-0009	enc:임태현	enc:950222-1012345	enc:010-0123-0009	enc:경기도 성남시	2026-03-05 06:06:24.283
SUBJ-2024-0010	enc:한소희	enc:970710-2123456	enc:010-1234-0010	enc:서울시 송파구	2026-03-05 06:06:24.296
SUBJ-2024-0011	enc:서진우	enc:800930-1234568	enc:010-2345-0011	enc:부산시 사상구	2026-03-05 06:06:24.307
SUBJ-2024-0012	enc:오지은	enc:930425-2345679	enc:010-3456-0012	enc:인천시 연수구	2026-03-05 06:06:24.321
SUBJ-2024-0013	enc:문성준	enc:871120-1456780	enc:010-4567-0013	enc:서울시 은평구	2026-03-05 06:06:24.334
SUBJ-2024-0014	enc:배지현	enc:020815-4567891	enc:010-5678-0014	enc:경기도 화성시	2026-03-05 06:06:24.349
SUBJ-2024-0015	enc:장민철	enc:720503-1678902	enc:010-6789-0015	enc:울산시 남구	2026-03-05 06:06:24.359
SUBJ-2025-0001	enc:고준혁	enc:910901-1789013	enc:010-7890-0016	enc:서울시 노원구	2026-03-05 06:06:24.377
SUBJ-2025-0002	enc:신아영	enc:980614-2890124	enc:010-8901-0017	enc:부산시 동래구	2026-03-05 06:06:24.39
SUBJ-2025-0003	enc:류동훈	enc:860227-1901235	enc:010-0123-0018	enc:경기도 안산시	2026-03-05 06:06:24.401
SUBJ-2025-0004	enc:조은서	enc:940318-2012346	enc:010-1234-0019	enc:대구시 수성구	2026-03-05 06:06:24.411
SUBJ-2025-0005	enc:권병찬	enc:820711-1123457	enc:010-2345-0020	enc:전북 전주시	2026-03-05 06:06:24.419
\.


--
-- Data for Name: tb_supporter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_supporter (supporter_id, supporter_nm, phone_enc, center_id, is_active, is_deleted, created_at) FROM stdin;
\.


--
-- Data for Name: tb_supporter_assignment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_supporter_assignment (assign_id, supporter_id, subject_id, start_date, end_date, is_active) FROM stdin;
\.


--
-- Data for Name: tb_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_user (user_id, role_id, center_id, user_nm, email, pwd_hash, is_active, is_deleted, deleted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tb_user_login_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tb_user_login_log (log_id, user_id, login_at, ip_addr, result) FROM stdin;
\.


--
-- Name: na_audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.na_audit_log_audit_id_seq', 1, false);


--
-- Name: tb_audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_audit_log_audit_id_seq', 1, false);


--
-- Name: tb_case_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_case_case_id_seq', 12, true);


--
-- Name: tb_case_closing_closing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_case_closing_closing_id_seq', 1, true);


--
-- Name: tb_case_event_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_case_event_event_id_seq', 35, true);


--
-- Name: tb_case_monitoring_monitor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_case_monitoring_monitor_id_seq', 8, true);


--
-- Name: tb_case_support_support_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_case_support_support_id_seq', 1, false);


--
-- Name: tb_case_task_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_case_task_task_id_seq', 24, true);


--
-- Name: tb_closing_check_done_done_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_closing_check_done_done_id_seq', 1, false);


--
-- Name: tb_closing_checklist_tpl_tpl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_closing_checklist_tpl_tpl_id_seq', 16, true);


--
-- Name: tb_closing_history_closing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_closing_history_closing_id_seq', 1, false);


--
-- Name: tb_counseling_counsel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_counseling_counsel_id_seq', 27, true);


--
-- Name: tb_edu_legal_attendance_attend_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_edu_legal_attendance_attend_id_seq', 9, true);


--
-- Name: tb_edu_legal_edu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_edu_legal_edu_id_seq', 7, true);


--
-- Name: tb_edu_outreach_outreach_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_edu_outreach_outreach_id_seq', 6, true);


--
-- Name: tb_edu_program_program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_edu_program_program_id_seq', 1, false);


--
-- Name: tb_edu_session_attend_attend_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_edu_session_attend_attend_id_seq', 1, false);


--
-- Name: tb_edu_session_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_edu_session_session_id_seq', 1, false);


--
-- Name: tb_family_family_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_family_family_id_seq', 1, false);


--
-- Name: tb_faq_faq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_faq_faq_id_seq', 1, false);


--
-- Name: tb_form_template_form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_form_template_form_id_seq', 1, false);


--
-- Name: tb_intake_intake_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_intake_intake_id_seq', 12, true);


--
-- Name: tb_intake_step_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_intake_step_log_log_id_seq', 57, true);


--
-- Name: tb_integration_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_integration_log_log_id_seq', 1, false);


--
-- Name: tb_isp_goal_goal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_isp_goal_goal_id_seq', 1, false);


--
-- Name: tb_isp_intervention_intervention_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_isp_intervention_intervention_id_seq', 1, false);


--
-- Name: tb_isp_isp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_isp_isp_id_seq', 1, false);


--
-- Name: tb_isp_problem_problem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_isp_problem_problem_id_seq', 1, false);


--
-- Name: tb_notice_notice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_notice_notice_id_seq', 1, false);


--
-- Name: tb_report_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_report_report_id_seq', 1, false);


--
-- Name: tb_resource_referral_referral_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_resource_referral_referral_id_seq', 1, false);


--
-- Name: tb_resource_resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_resource_resource_id_seq', 1, false);


--
-- Name: tb_stats_monthly_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_stats_monthly_stats_id_seq', 1, false);


--
-- Name: tb_subject_drug_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_subject_drug_id_seq', 26, true);


--
-- Name: tb_supporter_assignment_assign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_supporter_assignment_assign_id_seq', 1, false);


--
-- Name: tb_user_login_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tb_user_login_log_log_id_seq', 1, false);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: na_audit_log na_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_audit_log
    ADD CONSTRAINT na_audit_log_pkey PRIMARY KEY (audit_id);


--
-- Name: na_member_drug_use na_member_drug_use_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_drug_use
    ADD CONSTRAINT na_member_drug_use_pkey PRIMARY KEY (drug_use_id);


--
-- Name: na_member_program_enroll na_member_program_enroll_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_program_enroll
    ADD CONSTRAINT na_member_program_enroll_pkey PRIMARY KEY (enroll_id);


--
-- Name: na_member_referral na_member_referral_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_referral
    ADD CONSTRAINT na_member_referral_pkey PRIMARY KEY (referral_id);


--
-- Name: na_member_session_attendance na_member_session_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_session_attendance
    ADD CONSTRAINT na_member_session_attendance_pkey PRIMARY KEY (attendance_id);


--
-- Name: na_member_test na_member_test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_test
    ADD CONSTRAINT na_member_test_pkey PRIMARY KEY (test_id);


--
-- Name: na_program na_program_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_program
    ADD CONSTRAINT na_program_pkey PRIMARY KEY (program_id);


--
-- Name: na_program_session na_program_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_program_session
    ADD CONSTRAINT na_program_session_pkey PRIMARY KEY (session_id);


--
-- Name: tb_audit_log tb_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_audit_log
    ADD CONSTRAINT tb_audit_log_pkey PRIMARY KEY (audit_id);


--
-- Name: tb_case_closing tb_case_closing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_closing
    ADD CONSTRAINT tb_case_closing_pkey PRIMARY KEY (closing_id);


--
-- Name: tb_case_event tb_case_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_event
    ADD CONSTRAINT tb_case_event_pkey PRIMARY KEY (event_id);


--
-- Name: tb_case_monitoring tb_case_monitoring_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_monitoring
    ADD CONSTRAINT tb_case_monitoring_pkey PRIMARY KEY (monitor_id);


--
-- Name: tb_case tb_case_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case
    ADD CONSTRAINT tb_case_pkey PRIMARY KEY (case_id);


--
-- Name: tb_case_support tb_case_support_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_support
    ADD CONSTRAINT tb_case_support_pkey PRIMARY KEY (support_id);


--
-- Name: tb_case_task tb_case_task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_task
    ADD CONSTRAINT tb_case_task_pkey PRIMARY KEY (task_id);


--
-- Name: tb_center tb_center_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_center
    ADD CONSTRAINT tb_center_pkey PRIMARY KEY (center_id);


--
-- Name: tb_closing_check_done tb_closing_check_done_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_check_done
    ADD CONSTRAINT tb_closing_check_done_pkey PRIMARY KEY (done_id);


--
-- Name: tb_closing_checklist_tpl tb_closing_checklist_tpl_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_checklist_tpl
    ADD CONSTRAINT tb_closing_checklist_tpl_pkey PRIMARY KEY (tpl_id);


--
-- Name: tb_closing_history tb_closing_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_history
    ADD CONSTRAINT tb_closing_history_pkey PRIMARY KEY (closing_id);


--
-- Name: tb_code_group tb_code_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_code_group
    ADD CONSTRAINT tb_code_group_pkey PRIMARY KEY (group_cd);


--
-- Name: tb_code tb_code_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_code
    ADD CONSTRAINT tb_code_pkey PRIMARY KEY (group_cd, code);


--
-- Name: tb_connector tb_connector_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_connector
    ADD CONSTRAINT tb_connector_pkey PRIMARY KEY (connector_id);


--
-- Name: tb_counseling tb_counseling_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_counseling
    ADD CONSTRAINT tb_counseling_pkey PRIMARY KEY (counsel_id);


--
-- Name: tb_edu_legal_attendance tb_edu_legal_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_legal_attendance
    ADD CONSTRAINT tb_edu_legal_attendance_pkey PRIMARY KEY (attend_id);


--
-- Name: tb_edu_legal tb_edu_legal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_legal
    ADD CONSTRAINT tb_edu_legal_pkey PRIMARY KEY (edu_id);


--
-- Name: tb_edu_outreach tb_edu_outreach_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_outreach
    ADD CONSTRAINT tb_edu_outreach_pkey PRIMARY KEY (outreach_id);


--
-- Name: tb_edu_program tb_edu_program_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_program
    ADD CONSTRAINT tb_edu_program_pkey PRIMARY KEY (program_id);


--
-- Name: tb_edu_session_attend tb_edu_session_attend_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_session_attend
    ADD CONSTRAINT tb_edu_session_attend_pkey PRIMARY KEY (attend_id);


--
-- Name: tb_edu_session tb_edu_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_session
    ADD CONSTRAINT tb_edu_session_pkey PRIMARY KEY (session_id);


--
-- Name: tb_family tb_family_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_family
    ADD CONSTRAINT tb_family_pkey PRIMARY KEY (family_id);


--
-- Name: tb_faq tb_faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_faq
    ADD CONSTRAINT tb_faq_pkey PRIMARY KEY (faq_id);


--
-- Name: tb_form_template tb_form_template_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_form_template
    ADD CONSTRAINT tb_form_template_pkey PRIMARY KEY (form_id);


--
-- Name: tb_intake tb_intake_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake
    ADD CONSTRAINT tb_intake_pkey PRIMARY KEY (intake_id);


--
-- Name: tb_intake_step_log tb_intake_step_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake_step_log
    ADD CONSTRAINT tb_intake_step_log_pkey PRIMARY KEY (log_id);


--
-- Name: tb_integration_log tb_integration_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_integration_log
    ADD CONSTRAINT tb_integration_log_pkey PRIMARY KEY (log_id);


--
-- Name: tb_isp_goal tb_isp_goal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_goal
    ADD CONSTRAINT tb_isp_goal_pkey PRIMARY KEY (goal_id);


--
-- Name: tb_isp_intervention tb_isp_intervention_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_intervention
    ADD CONSTRAINT tb_isp_intervention_pkey PRIMARY KEY (intervention_id);


--
-- Name: tb_isp tb_isp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp
    ADD CONSTRAINT tb_isp_pkey PRIMARY KEY (isp_id);


--
-- Name: tb_isp_problem tb_isp_problem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_problem
    ADD CONSTRAINT tb_isp_problem_pkey PRIMARY KEY (problem_id);


--
-- Name: tb_member_basic tb_member_basic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_basic
    ADD CONSTRAINT tb_member_basic_pkey PRIMARY KEY (member_reg_dt, member_reg_seq);


--
-- Name: tb_member_diagnosis tb_member_diagnosis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_diagnosis
    ADD CONSTRAINT tb_member_diagnosis_pkey PRIMARY KEY (member_reg_dt, member_reg_seq, input_dt, diag_cd);


--
-- Name: tb_member_eval_basic tb_member_eval_basic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_eval_basic
    ADD CONSTRAINT tb_member_eval_basic_pkey PRIMARY KEY (member_reg_dt, member_reg_seq, biz_type_cd, eval_dt, eval_tool_cd);


--
-- Name: tb_member_eval_detail tb_member_eval_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_eval_detail
    ADD CONSTRAINT tb_member_eval_detail_pkey PRIMARY KEY (member_reg_dt, member_reg_seq, biz_type_cd, eval_dt, eval_tool_cd, eval_tool_det_cd);


--
-- Name: tb_member_isp_assess_basic tb_member_isp_assess_basic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_isp_assess_basic
    ADD CONSTRAINT tb_member_isp_assess_basic_pkey PRIMARY KEY (member_reg_dt, member_reg_seq, assess_seq);


--
-- Name: tb_member_linkage tb_member_linkage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_linkage
    ADD CONSTRAINT tb_member_linkage_pkey PRIMARY KEY (link_dt, link_seq);


--
-- Name: tb_member_medication tb_member_medication_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_medication
    ADD CONSTRAINT tb_member_medication_pkey PRIMARY KEY (member_reg_dt, member_reg_seq, input_dt, input_seq);


--
-- Name: tb_notice tb_notice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_notice
    ADD CONSTRAINT tb_notice_pkey PRIMARY KEY (notice_id);


--
-- Name: tb_region tb_region_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_region
    ADD CONSTRAINT tb_region_pkey PRIMARY KEY (region_cd);


--
-- Name: tb_report tb_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_report
    ADD CONSTRAINT tb_report_pkey PRIMARY KEY (report_id);


--
-- Name: tb_resource tb_resource_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_resource
    ADD CONSTRAINT tb_resource_pkey PRIMARY KEY (resource_id);


--
-- Name: tb_resource_referral tb_resource_referral_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_resource_referral
    ADD CONSTRAINT tb_resource_referral_pkey PRIMARY KEY (referral_id);


--
-- Name: tb_role tb_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_role
    ADD CONSTRAINT tb_role_pkey PRIMARY KEY (role_id);


--
-- Name: tb_stats_monthly tb_stats_monthly_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_stats_monthly
    ADD CONSTRAINT tb_stats_monthly_pkey PRIMARY KEY (stats_id);


--
-- Name: tb_subject_drug tb_subject_drug_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_subject_drug
    ADD CONSTRAINT tb_subject_drug_pkey PRIMARY KEY (id);


--
-- Name: tb_subject_pii tb_subject_pii_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_subject_pii
    ADD CONSTRAINT tb_subject_pii_pkey PRIMARY KEY (subject_id);


--
-- Name: tb_subject tb_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_subject
    ADD CONSTRAINT tb_subject_pkey PRIMARY KEY (subject_id);


--
-- Name: tb_supporter_assignment tb_supporter_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_supporter_assignment
    ADD CONSTRAINT tb_supporter_assignment_pkey PRIMARY KEY (assign_id);


--
-- Name: tb_supporter tb_supporter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_supporter
    ADD CONSTRAINT tb_supporter_pkey PRIMARY KEY (supporter_id);


--
-- Name: tb_user_login_log tb_user_login_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_user_login_log
    ADD CONSTRAINT tb_user_login_log_pkey PRIMARY KEY (log_id);


--
-- Name: tb_user tb_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_user
    ADD CONSTRAINT tb_user_pkey PRIMARY KEY (user_id);


--
-- Name: idx_na_att_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_att_session ON public.na_member_session_attendance USING btree (session_id);


--
-- Name: idx_na_audit_actor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_audit_actor ON public.na_audit_log USING btree (actor_user_id);


--
-- Name: idx_na_audit_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_audit_entity ON public.na_audit_log USING btree (entity_name, entity_id);


--
-- Name: idx_na_audit_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_audit_time ON public.na_audit_log USING btree (created_at);


--
-- Name: idx_na_drug_use_member; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_drug_use_member ON public.na_member_drug_use USING btree (member_id);


--
-- Name: idx_na_drug_use_substance; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_drug_use_substance ON public.na_member_drug_use USING btree (substance_code);


--
-- Name: idx_na_enroll_member; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_enroll_member ON public.na_member_program_enroll USING btree (member_id);


--
-- Name: idx_na_ref_member; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_ref_member ON public.na_member_referral USING btree (member_id);


--
-- Name: idx_na_test_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_test_date ON public.na_member_test USING btree (test_date);


--
-- Name: idx_na_test_member; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_na_test_member ON public.na_member_test USING btree (member_id);


--
-- Name: na_member_program_enroll_member_id_program_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX na_member_program_enroll_member_id_program_id_key ON public.na_member_program_enroll USING btree (member_id, program_id);


--
-- Name: na_member_session_attendance_enroll_id_session_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX na_member_session_attendance_enroll_id_session_id_key ON public.na_member_session_attendance USING btree (enroll_id, session_id);


--
-- Name: na_program_session_program_id_session_no_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX na_program_session_program_id_session_no_key ON public.na_program_session USING btree (program_id, session_no);


--
-- Name: tb_case_closing_case_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tb_case_closing_case_id_key ON public.tb_case_closing USING btree (case_id);


--
-- Name: tb_intake_intake_no_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tb_intake_intake_no_key ON public.tb_intake USING btree (intake_no);


--
-- Name: tb_stats_monthly_yyyymm_center_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tb_stats_monthly_yyyymm_center_id_key ON public.tb_stats_monthly USING btree (yyyymm, center_id);


--
-- Name: tb_subject_case_no_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tb_subject_case_no_key ON public.tb_subject USING btree (case_no);


--
-- Name: tb_user_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tb_user_email_key ON public.tb_user USING btree (email);


--
-- Name: na_member_drug_use na_member_drug_use_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_drug_use
    ADD CONSTRAINT na_member_drug_use_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_member_program_enroll na_member_program_enroll_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_program_enroll
    ADD CONSTRAINT na_member_program_enroll_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_member_program_enroll na_member_program_enroll_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_program_enroll
    ADD CONSTRAINT na_member_program_enroll_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.na_program(program_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_member_referral na_member_referral_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_referral
    ADD CONSTRAINT na_member_referral_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_member_session_attendance na_member_session_attendance_enroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_session_attendance
    ADD CONSTRAINT na_member_session_attendance_enroll_id_fkey FOREIGN KEY (enroll_id) REFERENCES public.na_member_program_enroll(enroll_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_member_session_attendance na_member_session_attendance_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_session_attendance
    ADD CONSTRAINT na_member_session_attendance_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.na_program_session(session_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_member_test na_member_test_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_member_test
    ADD CONSTRAINT na_member_test_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: na_program_session na_program_session_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.na_program_session
    ADD CONSTRAINT na_program_session_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.na_program(program_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_case tb_case_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case
    ADD CONSTRAINT tb_case_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.tb_center(center_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tb_case_closing tb_case_closing_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_closing
    ADD CONSTRAINT tb_case_closing_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_case_event tb_case_event_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_event
    ADD CONSTRAINT tb_case_event_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_case_monitoring tb_case_monitoring_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_monitoring
    ADD CONSTRAINT tb_case_monitoring_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_case_support tb_case_support_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_support
    ADD CONSTRAINT tb_case_support_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_case_task tb_case_task_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_case_task
    ADD CONSTRAINT tb_case_task_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_center tb_center_region_cd_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_center
    ADD CONSTRAINT tb_center_region_cd_fkey FOREIGN KEY (region_cd) REFERENCES public.tb_region(region_cd) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_closing_check_done tb_closing_check_done_closing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_check_done
    ADD CONSTRAINT tb_closing_check_done_closing_id_fkey FOREIGN KEY (closing_id) REFERENCES public.tb_closing_history(closing_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_closing_check_done tb_closing_check_done_tpl_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_closing_check_done
    ADD CONSTRAINT tb_closing_check_done_tpl_id_fkey FOREIGN KEY (tpl_id) REFERENCES public.tb_closing_checklist_tpl(tpl_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_code tb_code_group_cd_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_code
    ADD CONSTRAINT tb_code_group_cd_fkey FOREIGN KEY (group_cd) REFERENCES public.tb_code_group(group_cd) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_counseling tb_counseling_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_counseling
    ADD CONSTRAINT tb_counseling_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_edu_legal_attendance tb_edu_legal_attendance_edu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_legal_attendance
    ADD CONSTRAINT tb_edu_legal_attendance_edu_id_fkey FOREIGN KEY (edu_id) REFERENCES public.tb_edu_legal(edu_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_edu_legal tb_edu_legal_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_legal
    ADD CONSTRAINT tb_edu_legal_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_edu_session_attend tb_edu_session_attend_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_session_attend
    ADD CONSTRAINT tb_edu_session_attend_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.tb_edu_session(session_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_edu_session tb_edu_session_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_edu_session
    ADD CONSTRAINT tb_edu_session_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.tb_edu_program(program_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_family tb_family_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_family
    ADD CONSTRAINT tb_family_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_intake tb_intake_converted_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake
    ADD CONSTRAINT tb_intake_converted_case_id_fkey FOREIGN KEY (converted_case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tb_intake_step_log tb_intake_step_log_intake_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake_step_log
    ADD CONSTRAINT tb_intake_step_log_intake_id_fkey FOREIGN KEY (intake_id) REFERENCES public.tb_intake(intake_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_intake tb_intake_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_intake
    ADD CONSTRAINT tb_intake_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tb_integration_log tb_integration_log_connector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_integration_log
    ADD CONSTRAINT tb_integration_log_connector_id_fkey FOREIGN KEY (connector_id) REFERENCES public.tb_connector(connector_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_isp tb_isp_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp
    ADD CONSTRAINT tb_isp_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.tb_case(case_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_isp_goal tb_isp_goal_isp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_goal
    ADD CONSTRAINT tb_isp_goal_isp_id_fkey FOREIGN KEY (isp_id) REFERENCES public.tb_isp(isp_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_isp_intervention tb_isp_intervention_isp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_intervention
    ADD CONSTRAINT tb_isp_intervention_isp_id_fkey FOREIGN KEY (isp_id) REFERENCES public.tb_isp(isp_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_isp_problem tb_isp_problem_isp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_isp_problem
    ADD CONSTRAINT tb_isp_problem_isp_id_fkey FOREIGN KEY (isp_id) REFERENCES public.tb_isp(isp_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_member_diagnosis tb_member_diagnosis_member_reg_dt_member_reg_seq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_diagnosis
    ADD CONSTRAINT tb_member_diagnosis_member_reg_dt_member_reg_seq_fkey FOREIGN KEY (member_reg_dt, member_reg_seq) REFERENCES public.tb_member_basic(member_reg_dt, member_reg_seq) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_member_eval_basic tb_member_eval_basic_member_reg_dt_member_reg_seq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_eval_basic
    ADD CONSTRAINT tb_member_eval_basic_member_reg_dt_member_reg_seq_fkey FOREIGN KEY (member_reg_dt, member_reg_seq) REFERENCES public.tb_member_basic(member_reg_dt, member_reg_seq) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_member_eval_detail tb_member_eval_detail_member_reg_dt_member_reg_seq_biz_typ_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_eval_detail
    ADD CONSTRAINT tb_member_eval_detail_member_reg_dt_member_reg_seq_biz_typ_fkey FOREIGN KEY (member_reg_dt, member_reg_seq, biz_type_cd, eval_dt, eval_tool_cd) REFERENCES public.tb_member_eval_basic(member_reg_dt, member_reg_seq, biz_type_cd, eval_dt, eval_tool_cd) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_member_isp_assess_basic tb_member_isp_assess_basic_member_reg_dt_member_reg_seq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_isp_assess_basic
    ADD CONSTRAINT tb_member_isp_assess_basic_member_reg_dt_member_reg_seq_fkey FOREIGN KEY (member_reg_dt, member_reg_seq) REFERENCES public.tb_member_basic(member_reg_dt, member_reg_seq) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_member_linkage tb_member_linkage_member_reg_dt_member_reg_seq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_linkage
    ADD CONSTRAINT tb_member_linkage_member_reg_dt_member_reg_seq_fkey FOREIGN KEY (member_reg_dt, member_reg_seq) REFERENCES public.tb_member_basic(member_reg_dt, member_reg_seq) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_member_medication tb_member_medication_member_reg_dt_member_reg_seq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_member_medication
    ADD CONSTRAINT tb_member_medication_member_reg_dt_member_reg_seq_fkey FOREIGN KEY (member_reg_dt, member_reg_seq) REFERENCES public.tb_member_basic(member_reg_dt, member_reg_seq) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_resource_referral tb_resource_referral_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_resource_referral
    ADD CONSTRAINT tb_resource_referral_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.tb_resource(resource_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_subject_drug tb_subject_drug_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_subject_drug
    ADD CONSTRAINT tb_subject_drug_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_subject_pii tb_subject_pii_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_subject_pii
    ADD CONSTRAINT tb_subject_pii_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_supporter_assignment tb_supporter_assignment_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_supporter_assignment
    ADD CONSTRAINT tb_supporter_assignment_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.tb_subject(subject_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_supporter_assignment tb_supporter_assignment_supporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_supporter_assignment
    ADD CONSTRAINT tb_supporter_assignment_supporter_id_fkey FOREIGN KEY (supporter_id) REFERENCES public.tb_supporter(supporter_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_user tb_user_center_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_user
    ADD CONSTRAINT tb_user_center_id_fkey FOREIGN KEY (center_id) REFERENCES public.tb_center(center_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tb_user_login_log tb_user_login_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_user_login_log
    ADD CONSTRAINT tb_user_login_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tb_user(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tb_user tb_user_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tb_user
    ADD CONSTRAINT tb_user_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.tb_role(role_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict gTwalrWragloOlHvHZHTGRXJhOs3sjBBhLfiNanNCXRPyKDDDCph3eaN6AwGnCB

