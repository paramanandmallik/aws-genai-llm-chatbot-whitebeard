import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

export default function useUserDetails() {
  const [userDetails, setUserDetails] = useState<{ firstName: string, lastName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const firstName = user.attributes.given_name || "First";
        const lastName = user.attributes.family_name || "Last";
        setUserDetails({ firstName, lastName });
      })
      .catch(() => {
        setUserDetails(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { userDetails, isLoading };
}

