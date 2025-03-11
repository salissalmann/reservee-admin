import { OrganizationData, ValidationRule } from "@/app/_types/organization-types";
import { toast } from "react-hot-toast";
import { stripHtml } from "@/app/_utils/utility-functions";

export const validateFormData = (formData: OrganizationData , edit : boolean = false): boolean => {
    const validations: ValidationRule[] = [
      { 
        condition: formData.name.length > 20, 
        message: "Organization name should be less than 20 characters" 
      },
      { 
        condition: stripHtml(formData.description).length > 500, 
        message: "Organization description should be less than 500 characters" 
      },
      { 
        condition: !formData.logoFile && !edit, 
        message: "Organization logo is required" 
      },
      { 
        condition: formData.logoFile && !edit ? formData.logoFile.size > 10 * 1024 * 1024 : false,
        message: "Organization logo should be less than 10mb" 
      },
      { 
        condition: formData.newLogoFile && edit ? formData.newLogoFile.size > 10 * 1024 * 1024 : false,
        message: "Organization logo should be less than 10mb" 
      },      
      { 
        condition: formData.newLogoFile && edit ? formData.newLogoFile.size > 10 * 1024 * 1024 : false,
        message: "Organization logo should be less than 10mb" 
      },      
      { 
        condition: formData.categories.length === 0,
        message: "Organization categories are required" 
      },
    ];
  
    for (const validation of validations) {
      if (validation.condition) {
        toast.error(validation.message);
        return false;
      }
    }
    return true;
  };
  