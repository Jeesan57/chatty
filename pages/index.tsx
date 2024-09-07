import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

const USERS_PER_PAGE = 2;

export default function Home() {
  const [page, setPage] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { user, isLoaded: isLoggedInUserLoaded } = useUser();

  useEffect(() => {
    async function fetchUsers(page: number) {
      const limit = USERS_PER_PAGE;
      let offset = page * limit;
      setLoading(true);
      const response = await fetch(
        `/api/users?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setLoading(false);
      const responseData = await response.json();
      console.log(responseData);
      let filteredUsers = responseData.data.filter(
        (listUser: any) => listUser.id !== user?.id,
      );
      setUsers(filteredUsers);
      setTotalPages(Math.ceil(responseData.totalCount / limit));
    }
    fetchUsers(page);
  }, [page]);

  return (
    <div>
      {isLoggedInUserLoaded && user && (
        <div className="flex bg-red-300">
          <Link href="/profile">
            <img
              src={user ? user.imageUrl : ""}
              alt="user"
              className="rounded-full h-8"
            />
          </Link>
          <div>
            <p>{`Hello, ${user.fullName}`}</p>
            <p> {`Email : ${user.emailAddresses[0].emailAddress}`}</p>
          </div>
        </div>
      )}
      {loading && <div>Loading...</div>}
      {!loading && (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <img
                src={user.imageUrl}
                alt="user"
                className="rounded-full h-8"
              />
              <div>
                {user.firstName} {user.lastName}
              </div>
              <div>{user.emailAddresses[0].emailAddress}</div>
            </div>
          ))}
        </div>
      )}

      <br />

      {JSON.stringify({
        currentPage: page + 1,
        totalPages: totalPages,
      })}
      <br />
      <button
        onClick={() => {
          setPage((prev) => prev - 1);
        }}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        onClick={() => {
          setPage((prev) => prev + 1);
        }}
        disabled={page === totalPages - 1}
      >
        Next
      </button>

      <button
        onClick={() =>
          user
            ?.setProfileImage({ file: null })
            .then(() => {
              user.reload();
            })
            .catch((e) => console.log(e))
        }
      >
        remove user picture
      </button>
    </div>
  );
}

// const SAMPLE_USER_DATA = {
//   id: "user_2lezEOExs0YPq7SzBva1C3MvSmO",
//   passwordEnabled: false,
//   totpEnabled: false,
//   backupCodeEnabled: false,
//   twoFactorEnabled: false,
//   banned: false,
//   locked: false,
//   createdAt: 1725555217571,
//   updatedAt: 1725555217620,
//   imageUrl:
//     "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybGV6RVFCc3NZWkRQaDVYQmM5UG5YUnprQ3EifQ",
//   hasImage: true,
//   primaryEmailAddressId: "idn_2lezE9YLXYyJ7q27h9lV3SDAjjD",
//   primaryPhoneNumberId: null,
//   primaryWeb3WalletId: null,
//   lastSignInAt: 1725555217578,
//   externalId: null,
//   username: null,
//   firstName: "grey",
//   lastName: "onion",
//   publicMetadata: {},
//   privateMetadata: {},
//   unsafeMetadata: {},
//   emailAddresses: [
//     {
//       id: "idn_2lezE9YLXYyJ7q27h9lV3SDAjjD",
//       emailAddress: "greyonion404@gmail.com",
//       verification: {
//         status: "verified",
//         strategy: "from_oauth_google",
//         externalVerificationRedirectURL: null,
//         attempts: null,
//         expireAt: null,
//         nonce: null,
//       },
//       linkedTo: [
//         { id: "idn_2lezE7Tx9R7GsFMrk7dWQ6OjrPL", type: "oauth_google" },
//       ],
//     },
//   ],
//   phoneNumbers: [],
//   web3Wallets: [],
//   externalAccounts: [
//     {
//       id: "idn_2lezE7Tx9R7GsFMrk7dWQ6OjrPL",
//       approvedScopes:
//         "email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile",
//       emailAddress: "greyonion404@gmail.com",
//       imageUrl: "",
//       username: null,
//       publicMetadata: {},
//       label: null,
//       verification: {
//         status: "verified",
//         strategy: "oauth_google",
//         externalVerificationRedirectURL: null,
//         attempts: null,
//         expireAt: 1725555810528,
//         nonce: null,
//       },
//     },
//   ],
//   samlAccounts: [],
//   lastActiveAt: 1725555217569,
//   createOrganizationEnabled: true,
//   createOrganizationsLimit: null,
// };
