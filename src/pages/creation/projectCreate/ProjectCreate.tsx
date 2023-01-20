import {
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { ProjectCreationVariables, ProjectUpdateVariables } from './types';
import { BiInfoCircle } from 'react-icons/bi';
import { createUseStyles } from 'react-jss';
import { useHistory, useParams } from 'react-router';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  MUTATION_CREATE_PROJECT,
  MUTATION_UPDATE_PROJECT,
} from '../../../graphql/mutations';
import { FileUpload } from '../../../components/molecules';
import {
  ButtonComponent,
  Card,
  ImageWithReload,
  TextArea,
  TextInputBox,
} from '../../../components/ui';
import {
  MarkDown,
  toInt,
  useNotification,
  validateEmail,
  validLightningAddress,
} from '../../../utils';
import { useAuthContext } from '../../../context';
import { QUERY_PROJECT_BY_NAME_OR_ID } from '../../../graphql';
import { Project } from '../../../types/generated/graphql';
import { ProjectValidations } from '../../../constants/validations/project';
import { UserValidations } from '../../../constants/validations';
import { colors, commonMarkdownUrl, getPath } from '../../../constants';
import { ProjectCreateLayout } from './components/ProjectCreateLayout';

type CreateProjectMutationResponseData = {
  createProject: Project | null;
};

type UpdateProjectMutationResponseData = {
  updateProject: Project | null;
};

const useStyles = createUseStyles({
  backIcon: {
    fontSize: '25px',
  },
  rowItem: {
    width: '100%',
    alignItems: 'flex-start',
    spacing: '5px',
  },
});

export const ProjectCreate = () => {
  const classes = useStyles();

  const params = useParams<{ projectId: string }>();
  const isEditingExistingProject = Boolean(params.projectId);

  const history = useHistory();
  const { toast } = useNotification();

  const { user, setUser } = useAuthContext();

  const [form, setForm] = useState<ProjectCreationVariables>({
    title: '',
    description: '',
    image: undefined,
    email: '',
    name: '',
  });

  const [formError, setFormError] = useState<{ [key: string]: any }>({});

  const [createProject, { loading: createLoading }] = useMutation<
    CreateProjectMutationResponseData,
    { input: ProjectCreationVariables }
  >(MUTATION_CREATE_PROJECT, {
    onCompleted({ createProject: createdProject }) {
      if (createdProject && createdProject.owners[0]) {
        const newOwnershipInfo = user.ownerOf.concat([
          {
            project: createdProject,
            owner: createdProject.owners[0],
          },
        ]);

        setUser({
          ...user,
          ...{
            ownerOf: newOwnershipInfo,
          },
        });

        history.push(
          getPath('launchProjectWithMilestonesAndRewards', createdProject.id),
        );
      }
    },
    onError(error) {
      toast({
        title: 'project creation failed!',
        description: `${error}`,
        status: 'error',
      });
    },
  });

  const [updateProject, { loading: updateLoading }] = useMutation<
    UpdateProjectMutationResponseData,
    { input: ProjectUpdateVariables }
  >(MUTATION_UPDATE_PROJECT, {
    onCompleted() {
      history.push(
        getPath('launchProjectWithMilestonesAndRewards', params.projectId),
      );
    },
    onError(error) {
      toast({
        title: 'project update failed!',
        description: `${error}`,
        status: 'error',
      });
    },
  });

  const [getProject] = useLazyQuery(QUERY_PROJECT_BY_NAME_OR_ID, {
    variables: {
      where: {
        name: form.name,
      },
    },
    onCompleted(data) {
      if (data && data.project && data.project.id) {
        setFormError({
          ...formError,
          name: 'This lightning address is already taken.',
        });
      }
    },
  });

  const [getProjectById, { loading, data }] = useLazyQuery(
    QUERY_PROJECT_BY_NAME_OR_ID,
    {
      variables: { where: { id: toInt(params.projectId) } },
      onCompleted(data) {
        if (data && data.project) {
          setForm({
            title: data.project.title,
            name: data.project.name,
            image: data.project.image,
            description: data.project.description,
            email: user.email || '',
          });
        }
      },
    },
  );

  const handleChange = (event: any) => {
    if (event) {
      const { name, value } = event.target;

      const newForm = { ...form, [name]: value || '' };

      if (name === 'title' && !isEditingExistingProject) {
        const projectName: string = value.split(' ').join('').toLowerCase();
        const sanitizedName = projectName.replaceAll(validLightningAddress, '');

        newForm.name = sanitizedName;
      }

      setForm(newForm);

      if (
        name === 'title' &&
        value.length > ProjectValidations.title.maxLength
      ) {
        setFormError({
          title: `Character limit: ${ProjectValidations.title.maxLength}/${value.length}`,
        });
      } else if (
        name === 'description' &&
        value.length > ProjectValidations.description.maxLength
      ) {
        setFormError({
          description: (
            <HStack
              width="100%"
              justifyContent="space-between"
              paddingTop="5px"
            >
              <Text fontSize="12px" color="brand.error">
                Character limit:
              </Text>
              <Text
                fontSize="12px"
                color="brand.error"
              >{` ${ProjectValidations.description.maxLength}/${value.length}`}</Text>
            </HStack>
          ),
        });
      } else {
        setFormError({});
      }
    }
  };

  const handleUpload = (url: string) => setForm({ ...form, image: url });

  const handleNextButtonTapped = () => {
    const isValid = validateForm();

    if (isValid) {
      if (isEditingExistingProject) {
        updateProject({
          variables: {
            input: {
              projectId: toInt(data?.project?.id),
              title: form.title,
              image: form.image,
              description: form.description,
            },
          },
        });
      } else {
        createProject({
          variables: {
            input: {
              ...form,
              email: user.email || form.email,
            },
          },
        });
      }
    }
  };

  const validateForm = () => {
    const errors: any = {};

    let isValid = true;

    if (!form.title) {
      errors.title = 'Title is a required field.';
      isValid = false;
    } else if (form.title.length > ProjectValidations.title.maxLength) {
      errors.title = `Title should be shorter than ${ProjectValidations.title.maxLength} characters.`;
      isValid = false;
    }

    if (!form.name) {
      errors.name = 'Project name is a required field.';
      isValid = false;
    } else if (
      form.name.length < ProjectValidations.name.minLength ||
      form.name.length > ProjectValidations.name.maxLength
    ) {
      errors.name = `Project name should be between ${ProjectValidations.name.minLength} and ${ProjectValidations.name.maxLength} characters.`;
      isValid = false;
    }

    if (!form.description) {
      errors.description = 'Project objective is a required field.';
      isValid = false;
    } else if (
      form.description.length > ProjectValidations.description.maxLength
    ) {
      errors.description = `Project objective should be shorter than ${ProjectValidations.description.maxLength} characters.`;
      isValid = false;
    }

    if (!form.email && !user.email) {
      errors.email = 'Email address is a required field.';
      isValid = false;
    } else if (!user.email && !validateEmail(form.email)) {
      errors.email = 'Please enter a valid email address.';
      isValid = false;
    } else if (form.email.length > UserValidations.email.maxLength) {
      errors.email = `Email address should be shorter than ${UserValidations.email.maxLength} characters.`;
      isValid = false;
    }

    if (!isValid) {
      setFormError(errors);
    }

    return isValid;
  };

  const handleBack = () => {
    history.push(getPath('publicProjectLaunch'));
  };

  useEffect(() => {
    getProjectById();
  }, [params.projectId]);

  const sideView = (
    <VStack
      justifyContent="flex-start"
      alignItems="flex-start"
      maxWidth="370px"
      spacing="10px"
    >
      <Text>Preview</Text>
      <Card padding="16px 10px" overflow="hidden" width="100%">
        <ImageWithReload
          src={form.image}
          height="222px"
          width="350px"
          noCacheId={(Math.random() + 1).toString(36).substring(7)}
        />
        <Text>geyser.fund/project</Text>
        <Text fontSize="28px" fontWeight={700}>
          {form.title || 'Project Title'}
        </Text>
        <Text
          fontSize="16px"
          color="brand.textGrey"
          wordBreak="break-word"
          isTruncated
        >
          <MarkDown>{form.description || 'project description'}</MarkDown>
        </Text>
      </Card>
    </VStack>
  );

  return (
    <ProjectCreateLayout
      handleBack={handleBack}
      sideView={sideView}
      title="Project details"
      subtitle="Step 1 of 3"
      percentage={33}
    >
      <VStack width="100%" alignItems="flex-start">
        <VStack className={classes.rowItem}>
          <Text>Project Title</Text>
          <TextInputBox
            name="title"
            onChange={handleChange}
            value={form.title}
            error={formError.title}
            onBlur={() => !isEditingExistingProject && getProject()}
          />
        </VStack>
        <VStack className={classes.rowItem}>
          <Text>Lightning Address Preview</Text>
          <InputGroup size="md" borderRadius="4px">
            <Input
              name="name"
              onChange={handleChange}
              value={form.name}
              isInvalid={Boolean(formError.name)}
              focusBorderColor={colors.primary}
              disabled={isEditingExistingProject}
              onBlur={() => !isEditingExistingProject && getProject()}
            />
            <InputRightAddon>@geyser.fund</InputRightAddon>
          </InputGroup>
          {formError.name && (
            <Text color="brand.error" fontSize="12px">
              {formError.name}
            </Text>
          )}
        </VStack>
        <VStack className={classes.rowItem}>
          <Text>Project Image</Text>
          <FileUpload onUploadComplete={handleUpload}>
            <HStack
              borderRadius="4px"
              backgroundColor="brand.bgGrey"
              width="100%"
              height="70px"
              justifyContent="center"
              alignItems="center"
              _hover={{ backgroundColor: 'brand.gray300' }}
            >
              <AiOutlineUpload />
              <Text>Select a header image</Text>
            </HStack>
          </FileUpload>
          <Text fontSize="12px" color="brand.neutral700">
            For best fit, pick an image around 800px x 200px. Image size limit:
            10MB.
          </Text>
        </VStack>
        <VStack className={classes.rowItem}>
          <Text>Main Objective</Text>
          <TextArea
            name="description"
            minHeight="120px"
            maxHeight="800px"
            height="fit-content"
            overflowY="auto"
            value={form.description}
            onChange={handleChange}
            error={formError.description}
          />
          {!formError.description && (
            <HStack width="100%" justifyContent="space-between">
              <HStack spacing="5px">
                <Text fontSize="12px" color="brand.neutral700">
                  For **Bold** and *Italic*, see more{' '}
                </Text>
                <HStack
                  as={Link}
                  href={commonMarkdownUrl}
                  isExternal
                  spacing="0px"
                  _focus={{}}
                >
                  <BiInfoCircle />
                  <Text fontSize="12px" color="brand.neutral700">
                    HTML MarkDown
                  </Text>
                </HStack>
              </HStack>

              <Text
                fontSize="12px"
                color="brand.neutral700"
              >{`${form.description.length}/${ProjectValidations.description.maxLength}`}</Text>
            </HStack>
          )}
        </VStack>

        <VStack className={classes.rowItem}>
          <Text>Project E-mail</Text>
          <TextInputBox
            name="email"
            value={user.email || form.email}
            onChange={handleChange}
            error={formError.email}
            isDisabled={Boolean(user.email)}
          />
        </VStack>
        <ButtonComponent
          isLoading={loading || createLoading || updateLoading}
          primary
          isFullWidth
          onClick={handleNextButtonTapped}
          isDisabled={createLoading || updateLoading}
        >
          Next
        </ButtonComponent>
      </VStack>
    </ProjectCreateLayout>
  );
};
