import { FaClinicMedical } from "react-icons/fa";
import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";
import { FaHospitalUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

export const SideBarAdminData = [
    {   
        path: '/dashboard',
        icon: FaClinicMedical,
        heading: "Dashboard"
    },
    {
        path: '/pasien-baru',
        icon: BsFillFileEarmarkMedicalFill,
        heading: "Data Pasien"
    },
    {
        path: '/riwayat-pasien',
        icon: FaHospitalUser,
        heading: "Riwayat Pasien"
    },
    {
        path: '/pengaturan',
        icon: IoMdSettings,
        heading: "Pengaturan"
    },
]