<template>
  <div class="-pt-6 px-4">
    <div class="flex items-center h-[50px]">
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        type="button"
        class="text-xs rounded-lg bg-primary-200 py-1 px-3"
      >
        Clear filters
      </button>
      <div v-else class="text-xs opacity-50">Find your favourite</div>
    </div>
    <form>
      <div
        v-for="section in filterSections"
        :key="section.id"
        class="border-b border-gray-200 py-6"
      >
        <Disclosure as="div" :default-open="true">
          <template #default="{ open }">
            <h3 class="-my-3 flow-root">
              <DisclosureButton
                class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
              >
                <span class="font-medium text-gray-800">{{
                  section.name
                }}</span>
                <span class="ml-6 flex items-center">
                  <ChevronDownIcon
                    v-if="!open"
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                  <ChevronUpIcon v-else class="h-5 w-5" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </h3>
            <DisclosurePanel class="pt-6">
              <div class="space-y-4">
                <div
                  v-for="(option, optionIdx) in section.options"
                  :key="option"
                  class="flex items-center"
                >
                  <input
                    :id="`filter-${section.id}-${optionIdx}`"
                    :name="`${section.id}[]`"
                    :value="option"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    @change="updateFilter($event, section.id)"
                    :checked="isChecked(section.id, option)"
                  />
                  <label
                    :for="`filter-${section.id}-${optionIdx}`"
                    class="capitalize ml-3 text-sm text-gray-800"
                    >{{ option }}</label
                  >
                </div>
              </div>
            </DisclosurePanel>
          </template>
        </Disclosure>
      </div>
    </form>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/20/solid";
import { computed } from "vue";

const props = defineProps({
  activeFilters: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["apply-filters", "clear-filters"]);

const filterSections = [
  {
    id: "flavour",
    name: "Flavour",
    options: [
      "Almond",
      "Black Cherry",
      "Blackcurrant",
      "Blueberry",
      "Caramel",
      "Cardamom",
      "Chocolate",
      "Cinnamon",
      "Citrus",
      "Citrusy",
      "Clove",
      "Cocoa",
      "Coconut",
      "Dark Chocolate",
      "Earthy",
      "Espresso",
      "Floral",
      "Fruit",
      "Hazelnut",
      "Honey",
      "Milk Chocolate",
      "Molasses",
      "Nutty",
      "Smoke",
      "Smooth",
      "Spicy",
      "Toffee",
      "Tropical Fruit",
      "Vanilla",
    ],
  },
  {
    id: "roast level",
    name: "Roast Level",
    options: ["1", "2", "3", "4", "5"],
  },
  {
    id: "grind option",
    name: "Grind Option",
    options: [
      "Cafetiere",
      "Tea",
      "Espresso",
      "Filter",
      "French Press",
      "Pour Over",
      "Whole Bean",
    ],
  },
  {
    id: "region",
    name: "Region",
    options: [
      "Africa",
      "Asia Pacific",
      "Central America",
      "Middle East",
      "South America",
    ],
  },
];

const hasActiveFilters = computed(() => {
  return Object.keys(props.activeFilters).length > 0;
});

const isChecked = (filterId, value) => {
  return (
    props.activeFilters[filterId] &&
    props.activeFilters[filterId].includes(value.toString().toLowerCase())
  );
};

const updateFilter = (event, filterId) => {
  const value = event.target.value.toString().toLowerCase();
  const checked = event.target.checked;

  const newFilters = { ...props.activeFilters };

  if (!Array.isArray(newFilters[filterId])) {
    newFilters[filterId] = [];
  }

  if (checked) {
    if (!newFilters[filterId].includes(value)) {
      newFilters[filterId] = [...newFilters[filterId], value];
    }
  } else {
    newFilters[filterId] = newFilters[filterId].filter(
      (item) => item !== value
    );
    if (newFilters[filterId].length === 0) {
      delete newFilters[filterId];
    }
  }

  emit("apply-filters", newFilters);
};

const clearFilters = () => {
  emit("clear-filters");
};
</script>
