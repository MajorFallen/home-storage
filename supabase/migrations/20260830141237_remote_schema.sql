SET local check_function_bodies = off;

CREATE SCHEMA "internal";

CREATE TABLE "public"."household_members" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "household_id" uuid                     NOT NULL,
  "role"         text                     NOT NULL DEFAULT 'member'::text,
  "joined_at"    timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text),
  CONSTRAINT "household_members_pkey" PRIMARY KEY (id),
  CONSTRAINT "household_members_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'member'::text]))),
  "user_id"      uuid                     NOT NULL DEFAULT auth.uid(),
  CONSTRAINT "household_members_household_id_user_id_key" UNIQUE (household_id, user_id)
);

ALTER TABLE "public"."household_members"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."households" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  "name"       text                     NOT NULL DEFAULT ''::text,
  CONSTRAINT "households_pkey" PRIMARY KEY (id),
  "created_by" uuid                     DEFAULT auth.uid()
);

ALTER TABLE "public"."households"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."invite_codes" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "household_id" uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "code"         text                     NOT NULL,
  "created_by"   uuid                     DEFAULT gen_random_uuid(),
  "max_uses"     smallint,
  "uses_count"   smallint                 NOT NULL DEFAULT '0'::smallint,
  "expires_at"   timestamp with time zone,
  "created_at"   timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  CONSTRAINT "check_non_negative_uses" CHECK ((uses_count >= 0)),
  CONSTRAINT "check_positive_max_uses" CHECK (((max_uses IS NULL) OR (max_uses > 0))),
  CONSTRAINT "invite_codes_code_key" UNIQUE (code),
  CONSTRAINT "invite_codes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."invite_codes"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "created_at" timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  "email"      text                     NOT NULL,
  "role"       text                     NOT NULL DEFAULT 'user'::text,
  "name"       text                     NOT NULL DEFAULT ''::text,
  CONSTRAINT "profiles_email_key" UNIQUE (email),
  "id"         uuid                     NOT NULL DEFAULT auth.uid(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION internal.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'user'
  );
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION internal.is_member_of (
  _household_id uuid
)
  RETURNS boolean
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$SELECT EXISTS (
    SELECT 1 
    FROM public.household_members
    WHERE household_id = _household_id
      AND user_id = auth.uid()
  );$function$;

CREATE OR REPLACE FUNCTION internal.set_unique_invite_code()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  -- Generuj kod tylko, jeśli nie został podany ręcznie
  IF NEW.invite_code IS NULL THEN
    LOOP
      new_code := internal.generate_invite_code(8);
      
      SELECT EXISTS (
        SELECT 1 FROM public.households WHERE invite_code = new_code
      ) INTO code_exists;
      
      -- Wyjdź z pętli, gdy kod jest unikalny
      EXIT WHEN NOT code_exists;
    END LOOP;
    
    NEW.invite_code := new_code;
  END IF;
  
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.handle_new_household()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
BEGIN
  INSERT INTO public.household_members (household_id, user_id, role)
  VALUES (
    NEW.id,          -- ID nowo utworzonego domostwa
    NEW.created_by,  -- ID użytkownika, który je stworzył
    'owner'          -- Rola właściciela
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$BEGIN
  -- 1. Tworzymy profil w public.profiles
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      ''
    )
  );

  -- 2. Czyścimy raw_user_meta_data w auth.users
  UPDATE auth.users
  SET raw_user_meta_data = '{}'::jsonb
  WHERE id = NEW.id;

  RETURN NEW;
END;$function$;

ALTER TABLE "public"."household_members"
  ADD CONSTRAINT "household_members_household_id_fkey" FOREIGN KEY (household_id) REFERENCES public.households(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."invite_codes"
  ADD CONSTRAINT "invite_codes_household_id_fkey" FOREIGN KEY (household_id) REFERENCES public.households(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX idx_invite_codes_code ON public.invite_codes USING btree (code);

CREATE INDEX idx_invite_codes_household ON public.invite_codes USING btree (household_id);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_household_created
  AFTER INSERT ON public.households
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_household();

GRANT EXECUTE ON FUNCTION "internal"."handle_new_user"() TO "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "internal"."is_member_of"(uuid) TO "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "internal"."set_unique_invite_code"() TO "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_new_household"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT CREATE, USAGE ON SCHEMA "internal" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."household_members" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."households" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."invite_codes" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."household_members"
  ADD CONSTRAINT "household_members_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "public"."households"
  ADD CONSTRAINT "households_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "public"."invite_codes"
  ADD CONSTRAINT "invite_codes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL;

