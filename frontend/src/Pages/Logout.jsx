import {useAuth} from './AuthContext'
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useNavigate} from "react-router-dom";


const Logout = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        toast.success("You loged out successfuly");
        navigate("/");
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-300">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-6">
          <LogOut size={28} className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-blue-700">
            Logout From Your Account
          </h2>
        </div>
       <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-800 text-white rounded-lg font-medium hover:bg-blue-700 transition"
           >
                  Logout
      </motion.button>
      </motion.div>
    </div>
  )
}

export default Logout
