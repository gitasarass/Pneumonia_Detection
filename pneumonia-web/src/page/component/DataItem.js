import { FaClinicMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { BsFillLungsFill } from "react-icons/bs";
import { FaHospitalUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

export const SideBarData = [
    {   
        path: '/dashboard',
        icon: FaClinicMedical,
        heading: "Dashboard"
    },
    {
        path: '/pneumonia',
        icon: BsFillLungsFill,
        heading: "Cek Pneumonia"
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