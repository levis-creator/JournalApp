import { Icons } from "../Icons";

export type NavItem = {
    name: string;
    icon: React.ElementType;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  };
export type NavItems={
  main:NavItem[];
  others?:NavItem[];
}

 export const navItems:NavItems={
    main:[
      {
        icon: Icons.LibraryBig    ,
        name: "Dashboard",
        path:"/dashboard"
      },
      {
        icon: Icons.UserCircleIcon ,
        name: "User Profile",
        path: "/profile",
      },
    ],
    others:[
    ]
  }
  // admin Navigation
  export const adminItems:NavItems={
    main:[
      {
        icon: Icons.LibraryBig,
        name: "Dashboard",
        path:"/dashboard"
      },
      {
        icon: Icons.Boxes ,
        name: "Department",
        path:"/dashboard/department"
      },
     
      {
        icon: Icons.UserCircleIcon ,
        name: "User Profile",
        path: "/dashboard/profile",
      },

    ],
  }