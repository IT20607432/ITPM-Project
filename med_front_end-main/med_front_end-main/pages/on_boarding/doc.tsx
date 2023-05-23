import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import useGeolocation from "../../hooks/useGeolocation";
import { useEffect, useState } from "react";
import nearestCity from "../../utils/nearestCity";
import ICity from "../../interfaces/ICity";

const ProtectedPage = () => {
  const session: any = useSessionContext();
  const router = useRouter();
  const { longitude, latitude } = useGeolocation();

  const [city, setCity] = useState<ICity | null>(null);

  console.log(longitude, latitude);

  useEffect(() => {
    if (longitude && latitude) {
      setCity(
        nearestCity({ latitude: latitude, longitude: longitude }) ?? null
      );
    }
  }, [latitude, longitude]);

  const form = useForm({
    initialValues: {
      name: "",
      registrationNumber: "",
      educationalQualifications: "",
      termsOfService: false,
    },

    validate: {
      //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const onSubmit = async (values) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/on_boarding/doc/data/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.userId,
          doc_name: values.name,
          registration_number: values.registrationNumber,
          qualifications: values.educationalQualifications,
          longitude: longitude,
          latitude: latitude,
        }),
      }
    );

    router.push("/inquires");
  };

  return (
    <Box mx="10rem" mt="4rem">
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.onSubmit((values) => onSubmit(values))}
      >
        <TextInput
          withAsterisk
          label="Name"
          placeholder="First Last"
          {...form.getInputProps("name")}
        />
        <TextInput
          withAsterisk
          label="Registration Number"
          placeholder="NXXXXXXX"
          {...form.getInputProps("registrationNumber")}
        />
        <TextInput
          withAsterisk
          label="Educational Qualifications"
          placeholder="BSc, MSc..."
          {...form.getInputProps("educationalQualifications")}
        />

        <div>
          <h4>Location Data: </h4>
          <p>{city ? city.name : "Allow location access"}</p>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 px-4 py-2 rounded-lg text-white"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </Box>
  );
};

export default function Doc(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
