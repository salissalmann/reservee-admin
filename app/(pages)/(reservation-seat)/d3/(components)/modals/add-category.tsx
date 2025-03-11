import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Category } from '../../interface';


const AddCategoryPopup = ({ active, setModal, categories, setCategories }:
    { active: boolean, setModal: (active: boolean) => void, categories: Category[], setCategories: (categories: Category[]) => void }
  ) => {
    const [newCategory, setNewCategory] = useState({
      name: '',
      acronym: '',
      color: '#000000',
      seatCount: 0,
      price: 0,
    });
  
  
    const addCategory = () => {
      if (!newCategory.name) {
        toast.error("Category name is required.");
        return;
      }
      if (!newCategory.acronym) {
        toast.error("Category acronym is required.");
        return;
      }
      if (!newCategory.color) {
        //set default color
        newCategory.color = '#000000';
      }
      if (newCategory.price <= 0) {
        toast.error("Price must be greater than zero.");
        return;
      }
  
      setCategories([...categories, { ...newCategory, seatCount: 0 }]);
      setNewCategory({ name: '', acronym: '', color: '', seatCount: 0, price: 0 });
      setModal(false);
    };
  
  
    return (
      <div className={`${active ? "" : "hidden"} fixed inset-0 z-[1000] flex justify-center items-center backdrop-blur-md`}>
        <div className="relative w-full max-w-2xl p-4">
          <div className="relative p-4 dark:bg-tertiary bg-white rounded-lg shadow border border-gray-50 dark:border-borderDark">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-50 dark:border-borderDark rounded-t sm:mb-5">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 ">
                Add Category
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                data-modal-target="createProductModal"
                data-modal-toggle="createProductModal"
                onClick={() => {
                  setModal(false);
                }}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Enclosure Name"
                  className="border border-gray-50 dark:border-borderDark"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Enclosure Acronym"
                  className="border border-gray-50 dark:border-borderDark"
                  value={newCategory.acronym}
                  onChange={(e) => setNewCategory({ ...newCategory, acronym: e.target.value })}
                />
                <div className="grid grid-cols-[60%,40%] gap-2 items-center">
                  <h3 className="dark:text-white text-black font-bold">Color</h3>
                  <div className="flex justify-end items-end">
                    <div className="flex justify-end items-end gap-3">
                      <Input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="w-12 h-8 p-0 border-0 rounded cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                      />
                    </div>
                  </div>              </div>
                <div className="grid grid-cols-[60%,40%] gap-2 items-center">
                  <h3 className="dark:text-white text-black font-bold">Price</h3>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newCategory.price}
                    onChange={(e) => setNewCategory({ ...newCategory, price: Math.max(0, parseFloat(e.target.value)) })} // Updated to handle decimal values
                    min="0"
                    step="0.01"
                    className="w-full h-10 border border-gray-300 rounded-md cursor-pointer bg-white dark:bg-tertiary"
                  />
                </div>            
                <button onClick={addCategory} className="bg-primary text-white font-bold rounded-full shadow-md hover:bg-white hover:text-primary border border-primary transition-all duration-300 p-2 text-sm md:text-md">
                  Add Enclosure
                </button>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    )
  }
 

export default AddCategoryPopup