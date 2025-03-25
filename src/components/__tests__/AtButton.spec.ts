// import AtButton from '@/components/atoms/AtButton.vue'
// import { mount } from '@vue/test-utils'
// import { describe, expect, it } from 'vitest'

// describe('atButton.vue', () => {
//   it('renders correctly with default props', () => {
//     const wrapper = mount(AtButton, {
//       slots: { default: 'Click me' },
//     })

//     expect(wrapper.find('button').exists()).toBe(true)
//     expect(wrapper.text()).toBe('Click me')
//   })

//   // it('applies variant and size classes correctly', async () => {
//   //   const wrapper = mount(AtButton, {
//   //     props: { variant: 'default', size: 'lg' },
//   //     slots: { default: 'Primary' },
//   //   })

//   //   expect(wrapper.classes().join(' ')).toMatch(/primary/)
//   //   expect(wrapper.classes().join(' ')).toMatch(/lg/)

//   //   await wrapper.setProps({ variant: 'secondary', size: 'sm' })
//   //   expect(wrapper.classes().join(' ')).toMatch(/secondary/)
//   //   expect(wrapper.classes().join(' ')).toMatch(/sm/)
//   // })

//   it('applies custom class when provided', () => {
//     const wrapper = mount(AtButton, {
//       props: { class: 'custom-class' },
//       slots: { default: 'Button' },
//     })

//     expect(wrapper.classes()).toContain('custom-class')
//   })

//   it('renders as different elements using the "as" prop', () => {
//     const wrapper = mount(AtButton, {
//       props: { as: 'a', href: '/about' },
//       slots: { default: 'Link Button' },
//     })

//     expect(wrapper.find('a').exists()).toBe(true)
//     expect(wrapper.find('a').attributes('href')).toBe('/about')
//   })

//   it('emits click event when clicked', async () => {
//     const wrapper = mount(AtButton, {
//       slots: { default: 'Clickable' },
//     })

//     await wrapper.trigger('click')

//     expect(wrapper.emitted()).toHaveProperty('click')
//     expect(wrapper.emitted('click')).toHaveLength(1)
//   })

//   it('does not emit click event when disabled', async () => {
//     const wrapper = mount(AtButton, {
//       props: { disabled: true },
//       slots: { default: 'Disabled' },
//     })

//     await wrapper.trigger('click')

//     expect(wrapper.emitted('click')).toBeFalsy()
//   })

//   it('correctly passes attributes to root element', () => {
//     const wrapper = mount(AtButton, {
//       attrs: {
//         'id': 'test-id',
//         'data-testid': 'button-test',
//         'aria-label': 'Test Button',
//       },
//     })

//     expect(wrapper.attributes('id')).toBe('test-id')
//     expect(wrapper.attributes('data-testid')).toBe('button-test')
//     expect(wrapper.attributes('aria-label')).toBe('Test Button')
//   })
// })
